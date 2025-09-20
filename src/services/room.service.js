const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Room, Tenant } = require('../models');
const ApiError = require('../utils/ApiError');

const createRoom = async (body) => Room.create(body);

const queryRooms = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  // Build where clause with LIKE for text fields and equal for enum fields
  const whereClause = {};
  if (filter.propertyId) whereClause.propertyId = filter.propertyId;
  if (filter.name) whereClause.name = { [Op.like]: `%${filter.name}%` };
  if (filter.status) whereClause.status = filter.status;

  const { count, rows } = await Room.findAndCountAll({
    where: whereClause,
    include: [{ model: Tenant, as: 'tenants' }],
    distinct: true,
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

const getRoomById = async (id) => Room.findByPk(id, { include: [{ model: Tenant, as: 'tenants' }] });

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
  // If room has tenants, set their roomId to null before deleting the room
  await Tenant.update({ roomId: null }, { where: { roomId: id } });
  await room.destroy();
  return room;
};

module.exports = {
  createRoom,
  queryRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  /**
   * Query rooms by propertyId
   */
  queryRoomsByPropertyId: async (propertyId, options) => {
    return queryRooms({ propertyId }, options || {});
  },
};
