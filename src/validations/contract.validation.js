const Joi = require('joi');

const createContract = {
  body: Joi.object().keys({
    roomId: Joi.number().integer().required(),
    tenantId: Joi.number().integer().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    depositAmount: Joi.number().precision(2).min(0).allow(null),
    paymentCycle: Joi.string().valid('monthly', 'quarterly', 'yearly').default('monthly'),
    status: Joi.string().valid('active', 'ended', 'cancelled').allow(null),
  }),
};

const getContracts = {
  query: Joi.object().keys({
    roomId: Joi.number().integer(),
    tenantId: Joi.number().integer(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getContract = {
  params: Joi.object().keys({
    contractId: Joi.number().integer().required(),
  }),
};

const updateContract = {
  params: Joi.object().keys({
    contractId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      roomId: Joi.number().integer(),
      tenantId: Joi.number().integer(),
      startDate: Joi.date(),
      endDate: Joi.date().allow(null),
      depositAmount: Joi.number().precision(2).min(0).allow(null),
      paymentCycle: Joi.string().valid('monthly', 'quarterly', 'yearly'),
      status: Joi.string().valid('active', 'ended', 'cancelled'),
    })
    .min(1),
};

const deleteContract = {
  params: Joi.object().keys({
    contractId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract,
};
