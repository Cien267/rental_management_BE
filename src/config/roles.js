const allRoles = {
  user: ['getProperties', 'manageProperties'],
  admin: [
    'getUsers',
    'manageUsers',
    'getProperties',
    'manageProperties',
    'getRooms',
    'manageRooms',
    'getTenants',
    'manageTenants',
    'getContracts',
    'manageContracts',
    'getUtilityMeters',
    'manageUtilityMeters',
    'getInvoices',
    'manageInvoices',
    'getPayments',
    'managePayments',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
