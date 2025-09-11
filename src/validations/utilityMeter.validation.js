const Joi = require('joi');

const createUtilityMeter = {
  body: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
    meterType: Joi.string().valid('electricity', 'water').required(),
    roomId: Joi.number().integer().allow(null),
    active: Joi.boolean().default(true),
    unit: Joi.string().max(20).default('kWh'),
    notes: Joi.string().allow('', null),
  }),
};

const getUtilityMeters = {
  query: Joi.object().keys({
    propertyId: Joi.number().integer(),
    roomId: Joi.number().integer(),
    meterType: Joi.string(),
    active: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUtilityMeter = {
  params: Joi.object().keys({
    utilityMeterId: Joi.number().integer().required(),
  }),
};

const updateUtilityMeter = {
  params: Joi.object().keys({
    utilityMeterId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      propertyId: Joi.number().integer(),
      meterType: Joi.string().valid('electricity', 'water'),
      roomId: Joi.number().integer().allow(null),
      active: Joi.boolean(),
      unit: Joi.string().max(20),
      notes: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteUtilityMeter = {
  params: Joi.object().keys({
    utilityMeterId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createUtilityMeter,
  getUtilityMeters,
  getUtilityMeter,
  updateUtilityMeter,
  deleteUtilityMeter,
};
