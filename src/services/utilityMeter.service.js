const httpStatus = require('http-status');
const { UtilityMeter } = require('../models');
const ApiError = require('../utils/ApiError');
const { Room } = require('../models');

const createUtilityMeter = async (body) => {
  const data = { ...body };
  delete data.applyAll;

  if (body.applyAll) {
    const propertyId = body.propertyId || 0;

    const roomIds = await Room.findAll({
      where: { propertyId },
      attributes: ['id'],
      raw: true,
    });

    if (roomIds.length > 0) {
      // bulk create in parallel
      await Promise.all(roomIds.map(({ id }) => UtilityMeter.create({ ...data, roomId: id })));
    }
  } else {
    await UtilityMeter.create(data);
  }
};

const queryUtilityMeters = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await UtilityMeter.findAndCountAll({
    where: filter,
    include: [{ model: Room, as: 'room' }],
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

const getUtilityMeterById = async (id) => UtilityMeter.findByPk(id);

const updateUtilityMeterById = async (id, updateBody) => {
  const meter = await getUtilityMeterById(id);
  if (!meter) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đồng hồ điện nước');
  Object.assign(meter, updateBody);
  await meter.save();
  return meter;
};

const deleteUtilityMeterById = async (id) => {
  const meter = await getUtilityMeterById(id);
  if (!meter) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đồng hồ điện nước');
  await meter.destroy();
  return meter;
};

module.exports = {
  createUtilityMeter,
  queryUtilityMeters,
  getUtilityMeterById,
  updateUtilityMeterById,
  deleteUtilityMeterById,
};
