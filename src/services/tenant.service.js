const httpStatus = require('http-status');
const { Tenant, Contract, Room } = require('../models');
const ApiError = require('../utils/ApiError');

const createTenant = async (body) => Tenant.create(body);

const queryTenants = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }
  const { count, rows } = await Tenant.findAndCountAll({
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

const getTenantById = async (id) => Tenant.findByPk(id);

const updateTenantById = async (id, updateBody) => {
  const tenant = await getTenantById(id);
  if (!tenant) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người thuê');
  Object.assign(tenant, updateBody);
  await tenant.save();
  return tenant;
};

const deleteTenantById = async (id) => {
  const tenant = await getTenantById(id);
  if (!tenant) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người thuê');
  await tenant.destroy();
  return tenant;
};

module.exports = {
  createTenant,
  queryTenants,
  getTenantById,
  updateTenantById,
  deleteTenantById,
  /**
   * Query tenants that are associated with a property's rooms via contracts
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
      distinct: true,
      include: [
        {
          model: Contract,
          as: 'contracts',
          attributes: [],
          include: [{ model: Room, as: 'room', attributes: [], where: { propertyId } }],
        },
      ],
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
      where: { id: tenantId },
      include: [
        {
          model: Contract,
          as: 'contracts',
          attributes: ['id'],
          include: [{ model: Room, as: 'room', attributes: ['id', 'propertyId'], where: { propertyId } }],
        },
      ],
    });
    return !!found;
  },
};
