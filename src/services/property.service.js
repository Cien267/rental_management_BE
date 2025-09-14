const httpStatus = require('http-status');
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
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tài sản');
  Object.assign(property, updateBody);
  await property.save();
  return property;
};

const deletePropertyById = async (id) => {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tài sản');

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
};
