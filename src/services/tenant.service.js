const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Tenant, Room } = require('../models');
const ApiError = require('../utils/ApiError');

const createTenant = async (body) => {
  const tenant = await Tenant.create(body);

  // If tenant has a roomId, update room status to 'occupied'
  if (tenant.roomId) {
    await Room.update({ status: 'occupied' }, { where: { id: tenant.roomId } });
  }

  return tenant;
};

const queryTenants = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  // Build where clause with LIKE for text fields and equal for enum/ID fields
  const whereClause = {};
  if (filter.propertyId) whereClause.propertyId = filter.propertyId;
  if (filter.fullName) whereClause.fullName = { [Op.like]: `%${filter.fullName}%` };
  if (filter.phone) whereClause.phone = { [Op.like]: `%${filter.phone}%` };
  if (filter.email) whereClause.email = { [Op.like]: `%${filter.email}%` };
  if (filter.roomId) whereClause.roomId = filter.roomId;
  if (filter.gender) whereClause.gender = filter.gender;

  const { count, rows } = await Tenant.findAndCountAll({
    where: whereClause,
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

const getTenantById = async (id) => Tenant.findByPk(id, { include: [{ model: Room, as: 'room' }] });

const updateTenantById = async (id, updateBody) => {
  const tenant = await getTenantById(id);
  if (!tenant) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người thuê');

  const oldRoomId = tenant.roomId;
  const newRoomId = updateBody.roomId;

  Object.assign(tenant, updateBody);
  await tenant.save();

  // Handle room status updates
  if (oldRoomId !== newRoomId) {
    // Check if old room has any other tenants
    if (oldRoomId) {
      const otherTenantsInOldRoom = await Tenant.count({
        where: { roomId: oldRoomId, id: { [Op.ne]: id } },
      });

      // If no other tenants, set room status to 'available'
      if (otherTenantsInOldRoom === 0) {
        await Room.update({ status: 'available' }, { where: { id: oldRoomId } });
      }
    }

    // Update new room status to 'occupied'
    if (newRoomId) {
      await Room.update({ status: 'occupied' }, { where: { id: newRoomId } });
    }
  }

  return tenant;
};

const deleteTenantById = async (id) => {
  const tenant = await getTenantById(id);
  if (!tenant) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người thuê');

  const { roomId } = tenant;

  await tenant.destroy();

  // Check if the room has any other tenants and update status accordingly
  if (roomId) {
    const otherTenantsInRoom = await Tenant.count({
      where: { roomId },
    });

    // If no other tenants, set room status to 'available'
    if (otherTenantsInRoom === 0) {
      await Room.update({ status: 'available' }, { where: { id: roomId } });
    }
  }

  return tenant;
};

module.exports = {
  createTenant,
  queryTenants,
  getTenantById,
  updateTenantById,
  deleteTenantById,
  /**
   * Query tenants that belong to a specific property via propertyId
   */
  queryTenantsByPropertyId: async (propertyId, options) => {
    const { limit = 10, page = 1, sortBy } = options || {};
    const offset = (page - 1) * limit;
    const order = [];
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
    }

    const { rows, count } = await Tenant.findAndCountAll({
      where: { propertyId },
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
  },
  tenantBelongsToProperty: async (tenantId, propertyId) => {
    const found = await Tenant.findOne({
      where: { id: tenantId, propertyId },
    });
    return !!found;
  },
};
