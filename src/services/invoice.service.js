const httpStatus = require('http-status');
const { Invoice, Contract, Room, Property, UtilityMeter, UtilityMeterReading, ExtraFee } = require('../models');
const ApiError = require('../utils/ApiError');

const createInvoice = async (body) => {
  const { propertyId, roomId, month, year, periodStart, periodEnd, notes } = body;

  // 1. Get room record to get rentAmount and contractId
  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy phòng');
  }

  // Get active contract for this room
  const contract = await Contract.findOne({
    where: { 
      roomId,
      status: 'active'
    }
  });
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hợp đồng hoạt động cho phòng này');
  }

  // 2. Get property record for utility prices
  const property = await Property.findByPk(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tài sản');
  }

  // 3. Calculate utilities amount and breakdown
  let utilitiesAmount = 0;
  let utilitiesBreakdown = [];

  // Get utility meters for this room
  const utilityMeters = await UtilityMeter.findAll({
    where: { 
      roomId,
      active: true 
    }
  });

  for (const meter of utilityMeters) {
    // Get 2 latest readings for this meter
    const readings = await UtilityMeterReading.findAll({
      where: { utilityMeterId: meter.id },
      order: [['readingDate', 'DESC']],
      limit: 2
    });

    if (readings.length >= 2) {
      const latestReading = readings[0].value;
      const previousReading = readings[1].value;
      const usage = latestReading - previousReading;

      // Get price per unit based on meter type
      let pricePerUnit = 0;
      if (meter.meterType === 'electricity') {
        pricePerUnit = property.electricityPricePerKwh || 0;
      } else if (meter.meterType === 'water') {
        pricePerUnit = property.waterPricePerM3 || 0;
      }

      const total = usage * pricePerUnit;
      utilitiesAmount += total;

      utilitiesBreakdown.push({
        meterType: meter.meterType,
        meterId: meter.id,
        unit: meter.unit,
        previousReading: previousReading,
        latestReading: latestReading,
        usage: usage,
        pricePerUnit: pricePerUnit,
        total: total
      });
    }
  }

  // 4. Calculate extra fees amount and breakdown
  let extraFeesAmount = 0;
  let extraFeesBreakdown = [];

  const extraFees = await ExtraFee.findAll({
    where: {
      propertyId,
      isActive: true,
      chargeType: 'monthly'
    }
  });

  for (const fee of extraFees) {
    extraFeesAmount += fee.amount;
    extraFeesBreakdown.push({
      id: fee.id,
      name: fee.name,
      description: fee.description,
      amount: fee.amount,
      chargeType: fee.chargeType
    });
  }

  // 5. Calculate total amount
  const rentAmount = room.price;
  const totalAmount = rentAmount + utilitiesAmount + extraFeesAmount;

  // 6. Create invoice
  const invoiceData = {
    contractId: contract.id,
    propertyId,
    roomId,
    invoiceDate: new Date(), // Current time as invoiceDate
    periodStart,
    periodEnd,
    rentAmount,
    utilitiesAmount,
    extraFeesAmount,
    totalAmount,
    status: 'unpaid', // Auto set to unpaid
    notes,
    utilitiesBreakdown,
    extraFeesBreakdown
  };

  return Invoice.create(invoiceData);
};

const queryInvoices = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  
  // Support filtering by propertyId and roomId directly
  const whereClause = { ...filter };
  
  const { count, rows } = await Invoice.findAndCountAll({
    where: whereClause,
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

const getInvoiceById = async (id) => Invoice.findByPk(id);

const updateInvoiceById = async (id, updateBody) => {
  const invoice = await getInvoiceById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hóa đơn');
  Object.assign(invoice, updateBody);
  await invoice.save();
  return invoice;
};

const deleteInvoiceById = async (id) => {
  const invoice = await getInvoiceById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hóa đơn');
  await invoice.destroy();
  return invoice;
};

module.exports = {
  createInvoice,
  queryInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
  /**
   * Query invoices for a given property via contract -> room -> propertyId
   */
  queryInvoicesByPropertyId: async (propertyId, options) => {
    const { limit = 10, page = 1, sortBy } = options || {};
    const offset = (page - 1) * limit;
    const order = [];
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
    }

    const { rows, count } = await Invoice.findAndCountAll({
      where: { propertyId },
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
  },

  /**
   * Query invoices for a given room
   */
  queryInvoicesByRoomId: async (roomId, options) => {
    const { limit = 10, page = 1, sortBy } = options || {};
    const offset = (page - 1) * limit;
    const order = [];
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
    }

    const { rows, count } = await Invoice.findAndCountAll({
      where: { roomId },
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
  },
};
