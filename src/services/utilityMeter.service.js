const httpStatus = require('http-status');
const { UtilityMeter } = require('../models');
const ApiError = require('../utils/ApiError');

const createUtilityMeter = async (body) => UtilityMeter.create(body);

const queryUtilityMeters = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await UtilityMeter.findAndCountAll({
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

const getUtilityMeterById = async (id) => UtilityMeter.findByPk(id);

const updateUtilityMeterById = async (id, updateBody) => {
  const meter = await getUtilityMeterById(id);
  if (!meter) throw new ApiError(httpStatus.NOT_FOUND, 'Utility meter not found');
  Object.assign(meter, updateBody);
  await meter.save();
  return meter;
};

const deleteUtilityMeterById = async (id) => {
  const meter = await getUtilityMeterById(id);
  if (!meter) throw new ApiError(httpStatus.NOT_FOUND, 'Utility meter not found');
  await meter.destroy();
  return meter;
};

module.exports = {
  createUtilityMeter,
  queryUtilityMeters,
  getUtilityMeterById,
  updateUtilityMeterById,
  deleteUtilityMeterById,
};
