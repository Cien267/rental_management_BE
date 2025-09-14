const httpStatus = require('http-status');
const { Invoice } = require('../models');
const ApiError = require('../utils/ApiError');

const createInvoice = async (body) => {
  // Calculate totalAmount if not provided
  const totalAmount = body.totalAmount || (body.rentAmount || 0) + (body.utilitiesAmount || 0) + (body.extraFeesAmount || 0);
  return Invoice.create({ ...body, totalAmount });
};

const queryInvoices = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Invoice.findAndCountAll({
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
};
