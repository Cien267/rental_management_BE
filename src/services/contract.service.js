const httpStatus = require('http-status');
const { Contract, Room, Tenant } = require('../models');
const ApiError = require('../utils/ApiError');

const createContract = async (body) => Contract.create(body);

const queryContracts = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const offset = (page - 1) * limit;
  const order = [];
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
  }

  // Build where clause with equal for all contract fields (roomId, tenantId, status)
  const whereClause = {};
  if (filter.propertyId) whereClause.propertyId = filter.propertyId;
  if (filter.roomId) whereClause.roomId = filter.roomId;
  if (filter.tenantId) whereClause.tenantId = filter.tenantId;
  if (filter.status) whereClause.status = filter.status;

  const { count, rows } = await Contract.findAndCountAll({
    where: whereClause,
    include: [
      { model: Room, as: 'room' },
      { model: Tenant, as: 'tenant' },
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
};

const getContractById = async (id) => Contract.findByPk(id);

const updateContractById = async (id, updateBody) => {
  const contract = await getContractById(id);
  if (!contract) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hợp đồng');
  Object.assign(contract, updateBody);
  await contract.save();
  return contract;
};

const deleteContractById = async (id) => {
  const contract = await getContractById(id);
  if (!contract) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hợp đồng');
  await contract.destroy();
  return contract;
};

module.exports = {
  createContract,
  queryContracts,
  getContractById,
  updateContractById,
  deleteContractById,
  /**
   * Query contracts that belong to rooms of a property
   */
  queryContractsByPropertyId: async (propertyId, options) => {
    const { limit = 10, page = 1, sortBy } = options || {};
    const offset = (page - 1) * limit;
    const order = [];
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      order.push([field, direction === 'desc' ? 'DESC' : 'ASC']);
    }

    const { rows, count } = await Contract.findAndCountAll({
      where: {},
      include: [{ model: Room, as: 'room', where: { propertyId }, attributes: [] }],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order,
      distinct: true,
    });

    return {
      results: rows,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(count / limit),
      totalResults: count,
    };
  },
  contractBelongsToProperty: async (contractId, propertyId) => {
    const found = await Contract.findOne({
      where: { id: contractId },
      include: [{ model: Room, as: 'room', attributes: ['id', 'propertyId'], where: { propertyId } }],
    });
    return !!found;
  },
};
