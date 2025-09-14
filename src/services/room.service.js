const httpStatus = require('http-status');
const { Room } = require('../models');
const ApiError = require('../utils/ApiError');

const createRoom = async (body) => Room.create(body);

const queryRooms = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Room.findAndCountAll({
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

const getRoomById = async (id) => Room.findByPk(id);

const updateRoomById = async (id, updateBody) => {
  const room = await getRoomById(id);
  if (!room) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy phòng');
  Object.assign(room, updateBody);
  await room.save();
  return room;
};

const deleteRoomById = async (id) => {
  const room = await getRoomById(id);
  if (!room) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy phòng');
  await room.destroy();
  return room;
};

module.exports = {
  createRoom,
  queryRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
};
