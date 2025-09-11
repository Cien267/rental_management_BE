const Joi = require('joi');

const createRoom = {
  body: Joi.object().keys({
    propertyId: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    floor: Joi.number().integer().allow(null),
    area: Joi.number().precision(2).allow(null),
    price: Joi.number().precision(2).required(),
    status: Joi.string().valid('available', 'occupied', 'maintenance').allow(null),
    amenities: Joi.object().unknown(true).allow(null),
    maxOccupants: Joi.number().integer().min(1).default(1),
    currentOccupants: Joi.number().integer().min(0).default(0),
    note: Joi.string().allow('', null),
  }),
};

const getRooms = {
  query: Joi.object().keys({
    propertyId: Joi.number().integer(),
    name: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
};

const updateRoom = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      propertyId: Joi.number().integer(),
      name: Joi.string().max(100),
      floor: Joi.number().integer().allow(null),
      area: Joi.number().precision(2).allow(null),
      price: Joi.number().precision(2),
      status: Joi.string().valid('available', 'occupied', 'maintenance'),
      amenities: Joi.object().unknown(true).allow(null),
      maxOccupants: Joi.number().integer().min(1),
      currentOccupants: Joi.number().integer().min(0),
      note: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteRoom = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
