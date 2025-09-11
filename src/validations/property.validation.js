const Joi = require('joi');

const createProperty = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    name: Joi.string().max(150).required(),
    address: Joi.string().max(255).allow('', null),
    type: Joi.string().max(50).allow('', null),
    floors: Joi.number().integer().min(0).allow(null),
    image: Joi.string().allow('', null),
    status: Joi.number().integer().allow(null),
    code: Joi.string().max(32).required(),
    note: Joi.string().allow('', null),
    contactName: Joi.string().max(100).allow('', null),
    contactPhone: Joi.string().max(20).allow('', null),
    contactMail: Joi.string().email().max(150).allow('', null),
    electricityPricePerKwh: Joi.number().precision(4).allow(null),
    waterPricePerM3: Joi.number().precision(4).allow(null),
  }),
};

const getProperties = {
  query: Joi.object().keys({
    userId: Joi.number().integer(),
    name: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProperty = {
  params: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
  }),
};

const updateProperty = {
  params: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.number().integer(),
      name: Joi.string().max(150),
      address: Joi.string().max(255).allow('', null),
      type: Joi.string().max(50).allow('', null),
      floors: Joi.number().integer().min(0).allow(null),
      image: Joi.string().allow('', null),
      status: Joi.number().integer().allow(null),
      code: Joi.string().max(32),
      note: Joi.string().allow('', null),
      contactName: Joi.string().max(100).allow('', null),
      contactPhone: Joi.string().max(20).allow('', null),
      contactMail: Joi.string().email().max(150).allow('', null),
      electricityPricePerKwh: Joi.number().precision(4).allow(null),
      waterPricePerM3: Joi.number().precision(4).allow(null),
    })
    .min(1),
};

const deleteProperty = {
  params: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
};
