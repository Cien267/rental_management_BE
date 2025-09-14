const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { extraFeeService } = require('../services');

const createExtraFee = catchAsync(async (req, res) => {
  const fee = await extraFeeService.createExtraFee(req.body);
  res.status(httpStatus.CREATED).send(fee);
});

const getExtraFees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['propertyId', 'name', 'chargeType', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await extraFeeService.queryExtraFees(filter, options);
  res.send(result);
});

const getExtraFee = catchAsync(async (req, res) => {
  const fee = await extraFeeService.getExtraFeeById(req.params.extraFeeId);
  if (!fee) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy phí phụ thu' });
  }
  res.send(fee);
});

const updateExtraFee = catchAsync(async (req, res) => {
  const fee = await extraFeeService.updateExtraFeeById(req.params.extraFeeId, req.body);
  res.send(fee);
});

const deleteExtraFee = catchAsync(async (req, res) => {
  await extraFeeService.deleteExtraFeeById(req.params.extraFeeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createExtraFee,
  getExtraFees,
  getExtraFee,
  updateExtraFee,
  deleteExtraFee,
};
