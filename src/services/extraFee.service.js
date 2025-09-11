const httpStatus = require('http-status');
const { ExtraFee } = require('../models');
const ApiError = require('../utils/ApiError');

const createExtraFee = async (body) => ExtraFee.create(body);

const queryExtraFees = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await ExtraFee.findAndCountAll({
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

const getExtraFeeById = async (id) => ExtraFee.findByPk(id);

const updateExtraFeeById = async (id, updateBody) => {
  const fee = await getExtraFeeById(id);
  if (!fee) throw new ApiError(httpStatus.NOT_FOUND, 'Extra fee not found');
  Object.assign(fee, updateBody);
  await fee.save();
  return fee;
};

const deleteExtraFeeById = async (id) => {
  const fee = await getExtraFeeById(id);
  if (!fee) throw new ApiError(httpStatus.NOT_FOUND, 'Extra fee not found');
  await fee.destroy();
  return fee;
};

module.exports = {
  createExtraFee,
  queryExtraFees,
  getExtraFeeById,
  updateExtraFeeById,
  deleteExtraFeeById,
};
