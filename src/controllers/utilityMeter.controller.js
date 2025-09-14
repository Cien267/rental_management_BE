const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { utilityMeterService } = require('../services');

const createUtilityMeter = catchAsync(async (req, res) => {
  const meter = await utilityMeterService.createUtilityMeter(req.body);
  res.status(httpStatus.CREATED).send(meter);
});

const getUtilityMeters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['propertyId', 'roomId', 'meterType', 'active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await utilityMeterService.queryUtilityMeters(filter, options);
  res.send(result);
});

const getUtilityMeter = catchAsync(async (req, res) => {
  const meter = await utilityMeterService.getUtilityMeterById(req.params.utilityMeterId);
  if (!meter) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy đồng hồ điện nước' });
  }
  res.send(meter);
});

const updateUtilityMeter = catchAsync(async (req, res) => {
  const meter = await utilityMeterService.updateUtilityMeterById(req.params.utilityMeterId, req.body);
  res.send(meter);
});

const deleteUtilityMeter = catchAsync(async (req, res) => {
  await utilityMeterService.deleteUtilityMeterById(req.params.utilityMeterId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUtilityMeter,
  getUtilityMeters,
  getUtilityMeter,
  updateUtilityMeter,
  deleteUtilityMeter,
};
