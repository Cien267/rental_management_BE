const Joi = require('joi');

const createTenant = {
  body: Joi.object().keys({
    fullName: Joi.string().max(150).required(),
    phone: Joi.string().max(20).allow('', null),
    email: Joi.string().email().max(150).allow('', null),
    roomId: Joi.number().integer().required(),
    propertyId: Joi.number().integer(),
    permanentAddress: Joi.string().max(255).allow('', null),
    nationalIdNumber: Joi.string().max(50).allow('', null),
    emergencyContactName: Joi.string().max(150).allow('', null),
    emergencyContactPhone: Joi.string().max(20).allow('', null),
    emergencyContactRelation: Joi.string().max(50).allow('', null),
    occupation: Joi.string().max(100).allow('', null),
    note: Joi.string().allow('', null),
    gender: Joi.string().valid('male', 'female', 'other').allow(null),
    dateOfBirth: Joi.date().allow(null),
  }),
};

const getTenants = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    roomId: Joi.number().integer(),
    propertyId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTenant = {
  params: Joi.object().keys({
    tenantId: Joi.number().integer().required(),
  }),
};

const updateTenant = {
  params: Joi.object().keys({
    tenantId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string().max(150),
      phone: Joi.string().max(20).allow('', null),
      email: Joi.string().email().max(150).allow('', null),
      roomId: Joi.number().integer(),
      propertyId: Joi.number().integer(),
      permanentAddress: Joi.string().max(255).allow('', null),
      nationalIdNumber: Joi.string().max(50).allow('', null),
      emergencyContactName: Joi.string().max(150).allow('', null),
      emergencyContactPhone: Joi.string().max(20).allow('', null),
      emergencyContactRelation: Joi.string().max(50).allow('', null),
      occupation: Joi.string().max(100).allow('', null),
      note: Joi.string().allow('', null),
      gender: Joi.string().valid('male', 'female', 'other').allow(null),
      dateOfBirth: Joi.date().allow(null),
    })
    .min(1),
};

const deleteTenant = {
  params: Joi.object().keys({
    tenantId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant,
};
