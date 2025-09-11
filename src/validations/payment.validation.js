const Joi = require('joi');

const createPayment = {
  body: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
    amount: Joi.number().precision(2).required(),
    method: Joi.string().valid('cash', 'bank_transfer', 'online').allow(null),
    transactionCode: Joi.string().max(100).allow('', null),
    paidAt: Joi.date().allow(null),
  }),
};

const getPayments = {
  query: Joi.object().keys({
    invoiceId: Joi.number().integer(),
    method: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.number().integer().required(),
  }),
};

const updatePayment = {
  params: Joi.object().keys({
    paymentId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      invoiceId: Joi.number().integer(),
      amount: Joi.number().precision(2),
      method: Joi.string().valid('cash', 'bank_transfer', 'online'),
      transactionCode: Joi.string().max(100).allow('', null),
      paidAt: Joi.date().allow(null),
    })
    .min(1),
};

const deletePayment = {
  params: Joi.object().keys({
    paymentId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
