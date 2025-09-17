const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { tenantService } = require('../services');

const createTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.createTenant(req.body);
  res.status(httpStatus.CREATED).send(tenant);
});

const getTenants = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (req.params.propertyId || req.query.propertyId) {
    const propertyId = parseInt(req.params.propertyId || req.query.propertyId, 10);
    const result = await tenantService.queryTenantsByPropertyId(propertyId, options);
    return res.send(result);
  }
  const filter = pick(req.query, ['fullName', 'phone', 'email', 'idNumber']);
  const result = await tenantService.queryTenants(filter, options);
  return res.send(result);
});

const getTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy người thuê' });
  }
  if (req.params.propertyId) {
    const belongs = await tenantService.tenantBelongsToProperty(req.params.tenantId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy người thuê trong nhà trọ này' });
  }
  res.send(tenant);
});

const updateTenant = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const belongs = await tenantService.tenantBelongsToProperty(req.params.tenantId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy người thuê trong nhà trọ này' });
  }
  const tenant = await tenantService.updateTenantById(req.params.tenantId, req.body);
  res.send(tenant);
});

const deleteTenant = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const belongs = await tenantService.tenantBelongsToProperty(req.params.tenantId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy người thuê trong nhà trọ này' });
  }
  await tenantService.deleteTenantById(req.params.tenantId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant,
};
