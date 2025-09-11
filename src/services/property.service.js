const httpStatus = require('http-status');
const { Property } = require('../models');
const ApiError = require('../utils/ApiError');

const createProperty = async (body) => Property.create(body);

const queryProperties = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Property.findAndCountAll({
    where: filter,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order,
  });
  return {
    results: rows,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages: Math.ceil(count / limit),
    totalResults: count,
  };
};

const getPropertyById = async (id) => Property.findByPk(id);

const updatePropertyById = async (id, updateBody) => {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  Object.assign(property, updateBody);
  await property.save();
  return property;
};

const deletePropertyById = async (id) => {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  await property.destroy();
  return property;
};

module.exports = {
  createProperty,
  queryProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
};
