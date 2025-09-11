const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { tenantService } = require('../services');

const createTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.createTenant(req.body);
  res.status(httpStatus.CREATED).send(tenant);
});

const getTenants = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullName', 'phone', 'email', 'idNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tenantService.queryTenants(filter, options);
  res.send(result);
});

const getTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Tenant not found' });
  }
  res.send(tenant);
});

const updateTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.updateTenantById(req.params.tenantId, req.body);
  res.send(tenant);
});

const deleteTenant = catchAsync(async (req, res) => {
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
