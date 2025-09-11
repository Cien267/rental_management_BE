const httpStatus = require('http-status');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');

const createPayment = async (body) => Payment.create(body);

const queryPayments = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Payment.findAndCountAll({
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

const getPaymentById = async (id) => Payment.findByPk(id);

const updatePaymentById = async (id, updateBody) => {
  const payment = await getPaymentById(id);
  if (!payment) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

const deletePaymentById = async (id) => {
  const payment = await getPaymentById(id);
  if (!payment) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  await payment.destroy();
  return payment;
};

module.exports = {
  createPayment,
  queryPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
