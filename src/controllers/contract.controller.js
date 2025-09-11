const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { contractService } = require('../services');

const createContract = catchAsync(async (req, res) => {
  const contract = await contractService.createContract(req.body);
  res.status(httpStatus.CREATED).send(contract);
});

const getContracts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['roomId', 'tenantId', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await contractService.queryContracts(filter, options);
  res.send(result);
});

const getContract = catchAsync(async (req, res) => {
  const contract = await contractService.getContractById(req.params.contractId);
  if (!contract) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Contract not found' });
  }
  res.send(contract);
});

const updateContract = catchAsync(async (req, res) => {
  const contract = await contractService.updateContractById(req.params.contractId, req.body);
  res.send(contract);
});

const deleteContract = catchAsync(async (req, res) => {
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
