const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { contractService } = require('../services');

const createContract = catchAsync(async (req, res) => {
  const propertyId = parseInt(req.params.propertyId || req.query.propertyId, 10);
  req.body.propertyId = propertyId;
  const contract = await contractService.createContract(req.body);
  res.status(httpStatus.CREATED).send(contract);
});

const getContracts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const propertyId = parseInt(req.params.propertyId || req.query.propertyId, 10);
  const filter = pick(req.query, ['roomId', 'tenantId', 'status']);
  filter.propertyId = propertyId;
  const result = await contractService.queryContracts(filter, options);
  return res.send(result);
});

const getContract = catchAsync(async (req, res) => {
  const contract = await contractService.getContractById(req.params.contractId);
  if (!contract) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy hợp đồng' });
  }
  if (req.params.propertyId) {
    const belongs = await contractService.contractBelongsToProperty(req.params.contractId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy hợp đồng trong nhà trọ này' });
  }
  res.send(contract);
});

const updateContract = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const belongs = await contractService.contractBelongsToProperty(req.params.contractId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy hợp đồng trong nhà trọ này' });
  }
  const contract = await contractService.updateContractById(req.params.contractId, req.body);
  res.send(contract);
});

const deleteContract = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const belongs = await contractService.contractBelongsToProperty(req.params.contractId, req.params.propertyId);
    if (!belongs) return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy hợp đồng trong nhà trọ này' });
  }
  await contractService.deleteContractById(req.params.contractId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract,
};
