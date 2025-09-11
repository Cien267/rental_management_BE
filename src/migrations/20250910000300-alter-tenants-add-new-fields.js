module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tenants', 'permanentAddress', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn('Tenants', 'nationalIdNumber', { type: Sequelize.STRING(50), allowNull: true });
    await queryInterface.addColumn('Tenants', 'emergencyContactName', { type: Sequelize.STRING(150), allowNull: true });
    await queryInterface.addColumn('Tenants', 'emergencyContactPhone', { type: Sequelize.STRING(20), allowNull: true });
    await queryInterface.addColumn('Tenants', 'emergencyContactRelation', { type: Sequelize.STRING(50), allowNull: true });
    await queryInterface.addColumn('Tenants', 'occupation', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Tenants', 'note', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Tenants', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true,
    });
    await queryInterface.addColumn('Tenants', 'dateOfBirth', { type: Sequelize.DATEONLY, allowNull: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tenants', 'permanentAddress');
    await queryInterface.removeColumn('Tenants', 'nationalIdNumber');
    await queryInterface.removeColumn('Tenants', 'emergencyContactName');
    await queryInterface.removeColumn('Tenants', 'emergencyContactPhone');
    await queryInterface.removeColumn('Tenants', 'emergencyContactRelation');
    await queryInterface.removeColumn('Tenants', 'occupation');
    await queryInterface.removeColumn('Tenants', 'note');
    await queryInterface.removeColumn('Tenants', 'gender');
    await queryInterface.removeColumn('Tenants', 'dateOfBirth');
  },
};
