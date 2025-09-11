const Joi = require('joi');

const createInvoice = {
  body: Joi.object().keys({
    contractId: Joi.number().integer().required(),
    invoiceDate: Joi.date().required(),
    periodStart: Joi.date().required(),
    periodEnd: Joi.date().required(),
    rentAmount: Joi.number().precision(2).default(0),
    utilitiesAmount: Joi.number().precision(2).default(0),
    extraFeesAmount: Joi.number().precision(2).default(0),
    status: Joi.string().valid('unpaid', 'partially_paid', 'paid', 'overdue').allow(null),
    notes: Joi.string().allow('', null),
  }),
};

const getInvoices = {
  query: Joi.object().keys({
    contractId: Joi.number().integer(),
    invoiceDate: Joi.date(),
    periodStart: Joi.date(),
    periodEnd: Joi.date(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
};

const updateInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      contractId: Joi.number().integer(),
      invoiceDate: Joi.date(),
      periodStart: Joi.date(),
      periodEnd: Joi.date(),
      rentAmount: Joi.number().precision(2),
      utilitiesAmount: Joi.number().precision(2),
      extraFeesAmount: Joi.number().precision(2),
      status: Joi.string().valid('unpaid', 'partially_paid', 'paid', 'overdue'),
      notes: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
