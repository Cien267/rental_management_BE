const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { utilityMeterReadingService } = require('../services');

const createReading = catchAsync(async (req, res) => {
  const reading = await utilityMeterReadingService.createReading(req.body);
  res.status(httpStatus.CREATED).send(reading);
});

const createReadingsBulk = catchAsync(async (req, res) => {
  const readingsPayload = Array.isArray(req.body) ? req.body : [];
  const created = await utilityMeterReadingService.createReadingsBulk(readingsPayload);
  res.status(httpStatus.CREATED).send({ count: created.length, results: created });
});

const getReadings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['utilityMeterId', 'readingDate', 'propertyId', 'roomId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await utilityMeterReadingService.queryReadings(filter, options);
  res.send(result);
});

const getReading = catchAsync(async (req, res) => {
  const reading = await utilityMeterReadingService.getReadingById(req.params.readingId);
  if (!reading) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy chỉ số đọc' });
  }
  res.send(reading);
});

const updateReading = catchAsync(async (req, res) => {
  const reading = await utilityMeterReadingService.updateReadingById(req.params.readingId, req.body);
  res.send(reading);
});

const deleteReading = catchAsync(async (req, res) => {
  await utilityMeterReadingService.deleteReadingById(req.params.readingId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReading,
  createReadingsBulk,
  getReadings,
  getReading,
  updateReading,
  deleteReading,
};
