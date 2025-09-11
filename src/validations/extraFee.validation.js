const Joi = require('joi');

const createExtraFee = {
  body: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null),
    amount: Joi.number().precision(2).required(),
    chargeType: Joi.string().valid('monthly', 'one_time').default('monthly'),
    isActive: Joi.boolean().default(true),
  }),
};

const getExtraFees = {
  query: Joi.object().keys({
    propertyId: Joi.number().integer(),
    name: Joi.string(),
    chargeType: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExtraFee = {
  params: Joi.object().keys({
    extraFeeId: Joi.number().integer().required(),
  }),
};

const updateExtraFee = {
  params: Joi.object().keys({
    extraFeeId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      propertyId: Joi.number().integer(),
      name: Joi.string().max(100),
      description: Joi.string().allow('', null),
      amount: Joi.number().precision(2),
      chargeType: Joi.string().valid('monthly', 'one_time'),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteExtraFee = {
  params: Joi.object().keys({
    extraFeeId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createExtraFee,
  getExtraFees,
  getExtraFee,
  updateExtraFee,
  deleteExtraFee,
};
