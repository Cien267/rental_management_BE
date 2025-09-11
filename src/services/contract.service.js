const httpStatus = require('http-status');
const { Contract } = require('../models');
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
  const { count, rows } = await Contract.findAndCountAll({
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

const getContractById = async (id) => Contract.findByPk(id);

const updateContractById = async (id, updateBody) => {
  const contract = await getContractById(id);
  if (!contract) throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  Object.assign(contract, updateBody);
  await contract.save();
  return contract;
};

const deleteContractById = async (id) => {
  const contract = await getContractById(id);
  if (!contract) throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  await contract.destroy();
  return contract;
};

module.exports = {
  createContract,
  queryContracts,
  getContractById,
  updateContractById,
  deleteContractById,
};
