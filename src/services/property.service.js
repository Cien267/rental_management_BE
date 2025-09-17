const httpStatus = require('http-status');
const { Op, fn, col } = require('sequelize');
const { Property, Room, Contract, Invoice, Payment, UtilityMeter, UtilityMeterReading, ExtraFee } = require('../models');
const ApiError = require('../utils/ApiError');

const createProperty = async (body) => Property.create(body);

const queryProperties = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Property.findAndCountAll({
    where: filter,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order,
  });
  return {
    results: rows,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages: Math.ceil(count / limit),
    totalResults: count,
  };
};

const getPropertyById = async (id) => Property.findByPk(id);

const updatePropertyById = async (id, updateBody) => {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhà trọ');
  Object.assign(property, updateBody);
  await property.save();
  return property;
};

const deletePropertyById = async (id) => {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhà trọ');

  // Start a transaction to ensure all deletions succeed or fail together
  const transaction = await Property.sequelize.transaction();

  try {
    // 1. Get all rooms for this property
    const rooms = await Room.findAll({
      where: { propertyId: id },
      transaction,
    });

    // 2. Get all room IDs for bulk operations
    const roomIds = rooms.map((room) => room.id);

    if (roomIds.length > 0) {
      // 3. Get all contracts for these rooms
      const contracts = await Contract.findAll({
        where: { roomId: roomIds },
        transaction,
      });

      // 4. Get all contract IDs for bulk operations
      const contractIds = contracts.map((contract) => contract.id);

      if (contractIds.length > 0) {
        // 5. Get all invoices for these contracts
        const invoices = await Invoice.findAll({
          where: { contractId: contractIds },
          transaction,
        });

        // 6. Get all invoice IDs for bulk operations
        const invoiceIds = invoices.map((invoice) => invoice.id);

        if (invoiceIds.length > 0) {
          // 7. Delete all payments for these invoices
          await Payment.destroy({
            where: { invoiceId: invoiceIds },
            transaction,
          });
        }

        // 8. Delete all invoices for these contracts
        await Invoice.destroy({
          where: { contractId: contractIds },
          transaction,
        });
      }

      // 9. Delete all contracts for these rooms
      await Contract.destroy({
        where: { roomId: roomIds },
        transaction,
      });
    }

    // 10. Get all utility meters for this property
    const utilityMeters = await UtilityMeter.findAll({
      where: { propertyId: id },
      transaction,
    });

    // 11. Get all utility meter IDs for bulk operations
    const utilityMeterIds = utilityMeters.map((meter) => meter.id);

    if (utilityMeterIds.length > 0) {
      // 12. Delete all utility meter readings for these meters
      await UtilityMeterReading.destroy({
        where: { utilityMeterId: utilityMeterIds },
        transaction,
      });
    }

    // 13. Delete all utility meters for this property
    await UtilityMeter.destroy({
      where: { propertyId: id },
      transaction,
    });

    // 14. Delete all extra fees for this property
    await ExtraFee.destroy({
      where: { propertyId: id },
      transaction,
    });

    // 15. Delete all rooms for this property
    await Room.destroy({
      where: { propertyId: id },
      transaction,
    });

    // 16. Finally, delete the property itself
    await property.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return property;
  } catch (error) {
    // If any error occurs, rollback the transaction
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createProperty,
  queryProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  /**
   * Get dashboard overview data for a property
   * @param {number} propertyId
   */
  getPropertyDashboardById: async (propertyId) => {
    const property = await Property.findByPk(propertyId);
    if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhà trọ');

    // General info
    const totalRooms = await Room.count({ where: { propertyId } });

    // Rented rooms via active contracts mapped to roomIds under this property
    const rooms = await Room.findAll({ attributes: ['id', 'status'], where: { propertyId } });
    const roomIds = rooms.map((r) => r.id);

    let rentedRoomIds = [];
    if (roomIds.length > 0) {
      const activeContracts = await Contract.findAll({
        attributes: ['roomId'],
        where: {
          roomId: roomIds,
          status: 'active',
          startDate: { [Op.lte]: new Date() },
          [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: new Date() } }],
        },
        group: ['roomId'],
      });
      rentedRoomIds = activeContracts.map((c) => c.roomId);
    }

    const rentedRooms = rentedRoomIds.length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
    const availableRooms = Math.max(totalRooms - rentedRooms, 0);
    const occupancyRate = totalRooms > 0 ? Number(((rentedRooms / totalRooms) * 100).toFixed(2)) : 0;

    // Expiring contracts window markers
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Monthly revenue: sum of PAID invoices' totalAmount for current month and compare with previous month
    let monthlyRevenue = 0;
    let monthlyRevenueChangePercent = null;
    let unpaidInvoices = [];
    if (roomIds.length > 0) {
      const contracts = await Contract.findAll({ attributes: ['id'], where: { roomId: roomIds } });
      const contractIds = contracts.map((c) => c.id);
      if (contractIds.length > 0) {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const revenueRes = await Invoice.findAll({
          attributes: [[fn('COALESCE', fn('SUM', col('totalAmount')), 0), 'sumTotal']],
          where: {
            contractId: contractIds,
            invoiceDate: { [Op.between]: [startOfMonth, endOfMonth] },
            status: 'paid',
          },
          raw: true,
        });
        monthlyRevenue = Number((revenueRes && revenueRes[0] && revenueRes[0].sumTotal) || 0);

        const prevRevenueRes = await Invoice.findAll({
          attributes: [[fn('COALESCE', fn('SUM', col('totalAmount')), 0), 'sumTotal']],
          where: {
            contractId: contractIds,
            invoiceDate: { [Op.between]: [startOfPrevMonth, endOfPrevMonth] },
            status: 'paid',
          },
          raw: true,
        });
        const prevMonthlyRevenue = Number((prevRevenueRes && prevRevenueRes[0] && prevRevenueRes[0].sumTotal) || 0);
        if (prevMonthlyRevenue > 0) {
          monthlyRevenueChangePercent = Number(
            (((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100).toFixed(2)
          );
        } else {
          monthlyRevenueChangePercent = null;
        }

        unpaidInvoices = await Invoice.findAll({
          attributes: ['id', 'contractId', 'invoiceDate', 'periodStart', 'periodEnd', 'totalAmount', 'status'],
          where: {
            contractId: contractIds,
            status: 'unpaid',
          },
          order: [['invoiceDate', 'DESC']],
        });
      }
    }

    return {
      stats: {
        totalRooms,
        occupancyRate,
        rentedRooms,
      },
      general: {
        totalRooms,
        occupancyRate,
        propertyName: property.name,
        propertyCode: property.code,
        propertyAddress: property.address,
        propertyStatus: property.status,
      },
      monthlyRevenue,
      monthlyRevenueChangePercent,
      roomStatus: {
        totalRooms,
        rentedRooms,
        availableRooms,
        occupancyRate,
        maintenanceRooms,
      },
      attentionRequired: {
        unpaidInvoices,
        expiringContracts: roomIds.length
          ? await Contract.findAll({
              attributes: ['id', 'roomId', 'tenantId', 'startDate', 'endDate', 'status'],
              where: {
                roomId: roomIds,
                status: 'active',
                endDate: { [Op.ne]: null, [Op.between]: [now, in30Days] },
              },
              order: [['endDate', 'ASC']],
            })
          : [],
      },
    };
  },
};
