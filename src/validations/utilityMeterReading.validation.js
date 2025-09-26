const Joi = require('joi');

const createReading = {
  body: Joi.object().keys({
    utilityMeterId: Joi.number().integer().required(),
    readingDate: Joi.date().required(),
    value: Joi.number().precision(2).allow(null),
    propertyId: Joi.number().integer().required(),
    roomId: Joi.number().integer().allow(null),
  }),
};

const getReadings = {
  query: Joi.object().keys({
    utilityMeterId: Joi.number().integer(),
    readingDate: Joi.date(),
    propertyId: Joi.number().integer(),
    roomId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReading = {
  params: Joi.object().keys({
    readingId: Joi.number().integer().required(),
  }),
};

const updateReading = {
  params: Joi.object().keys({
    readingId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      utilityMeterId: Joi.number().integer(),
      readingDate: Joi.date(),
      value: Joi.number().precision(2).allow(null),
      propertyId: Joi.number().integer(),
      roomId: Joi.number().integer().allow(null),
    })
    .min(1),
};

const deleteReading = {
  params: Joi.object().keys({
    readingId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createReading,
  getReadings,
  getReading,
  updateReading,
  deleteReading,
};
