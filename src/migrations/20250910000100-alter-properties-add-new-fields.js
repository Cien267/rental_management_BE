module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Properties', 'image', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Properties', 'status', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Properties', 'code', { type: Sequelize.STRING(32), allowNull: false, defaultValue: '' });
    await queryInterface.addColumn('Properties', 'note', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Properties', 'contactName', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Properties', 'contactPhone', { type: Sequelize.STRING(20), allowNull: true });
    await queryInterface.addColumn('Properties', 'contactMail', { type: Sequelize.STRING(150), allowNull: true });
    await queryInterface.addColumn('Properties', 'electricityPricePerKwh', {
      type: Sequelize.DECIMAL(12, 4),
      allowNull: true,
    });
    await queryInterface.addColumn('Properties', 'waterPricePerM3', { type: Sequelize.DECIMAL(12, 4), allowNull: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'image');
    await queryInterface.removeColumn('Properties', 'status');
    await queryInterface.removeColumn('Properties', 'code');
    await queryInterface.removeColumn('Properties', 'note');
    await queryInterface.removeColumn('Properties', 'contactName');
    await queryInterface.removeColumn('Properties', 'contactPhone');
    await queryInterface.removeColumn('Properties', 'contactMail');
    await queryInterface.removeColumn('Properties', 'electricityPricePerKwh');
    await queryInterface.removeColumn('Properties', 'waterPricePerM3');
  },
};
