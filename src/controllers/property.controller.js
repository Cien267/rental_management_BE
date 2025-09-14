const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { propertyService } = require('../services');

const createProperty = catchAsync(async (req, res) => {
  const property = await propertyService.createProperty(req.body);
  res.status(httpStatus.CREATED).send(property);
});

const getProperties = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'name', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await propertyService.queryProperties(filter, options);
  res.send(result);
});

const getProperty = catchAsync(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.propertyId);
  if (!property) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy tài sản' });
  }
  res.send(property);
});

const updateProperty = catchAsync(async (req, res) => {
  const property = await propertyService.updatePropertyById(req.params.propertyId, req.body);
  res.send(property);
});

const deleteProperty = catchAsync(async (req, res) => {
  await propertyService.deletePropertyById(req.params.propertyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
};
