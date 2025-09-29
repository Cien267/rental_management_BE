const httpStatus = require('http-status');
const { UtilityMeterReading } = require('../models');
const ApiError = require('../utils/ApiError');

const createReading = async (body) => UtilityMeterReading.create(body);

const createReadingsBulk = async (readings) => {
  if (!Array.isArray(readings) || readings.length === 0) return [];
  // Use validate: true to run model-level validations; individual hooks are not needed here
  const created = await UtilityMeterReading.bulkCreate(readings, { validate: true, returning: true });
  return created;
};

const queryReadings = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }

  // Build where clause with equal for all reading fields (utilityMeterId, readingDate, propertyId, roomId)
  const whereClause = {};
  if (filter.utilityMeterId) whereClause.utilityMeterId = filter.utilityMeterId;
  if (filter.readingDate) whereClause.readingDate = filter.readingDate;
  if (filter.propertyId) whereClause.propertyId = filter.propertyId;
  if (filter.roomId) whereClause.roomId = filter.roomId;

  const { count, rows } = await UtilityMeterReading.findAndCountAll({
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

const getReadingById = async (id) => UtilityMeterReading.findByPk(id);

const updateReadingById = async (id, updateBody) => {
  const reading = await getReadingById(id);
  if (!reading) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy chỉ số đọc');
  Object.assign(reading, updateBody);
  await reading.save();
  return reading;
};

const deleteReadingById = async (id) => {
  const reading = await getReadingById(id);
  if (!reading) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy chỉ số đọc');
  await reading.destroy();
  return reading;
};

module.exports = {
  createReading,
  createReadingsBulk,
  queryReadings,
  getReadingById,
  updateReadingById,
  deleteReadingById,
};
