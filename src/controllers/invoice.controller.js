const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { invoiceService } = require('../services');

const createInvoice = catchAsync(async (req, res) => {
  const propertyId = parseInt(req.params.propertyId || req.query.propertyId, 10);
  req.body.propertyId = propertyId;
  const invoice = await invoiceService.createInvoice(req.body);
  res.status(httpStatus.CREATED).send(invoice);
});

const getInvoices = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // Handle general queries with support for propertyId and roomId filters
  const filter = pick(req.query, [
    'contractId',
    'propertyId',
    'roomId',
    'invoiceDate',
    'periodStart',
    'periodEnd',
    'status',
  ]);
  const propertyId = parseInt(req.params.propertyId || req.query.propertyId, 10);
  filter.propertyId = propertyId;

  const result = await invoiceService.queryInvoices(filter, options);
  return res.send(result);
});

const getInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.invoiceId);
  if (!invoice) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy hóa đơn' });
  }
  res.send(invoice);
});

const updateInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.updateInvoiceById(req.params.invoiceId, req.body);
  res.send(invoice);
});

const deleteInvoice = catchAsync(async (req, res) => {
  await invoiceService.deleteInvoiceById(req.params.invoiceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
