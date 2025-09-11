module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contracts', 'paymentCycle', {
      type: Sequelize.ENUM('monthly', 'quarterly', 'yearly'),
      allowNull: false,
      defaultValue: 'monthly',
    });
    await queryInterface.removeColumn('Contracts', 'monthlyRent');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contracts', 'monthlyRent', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
    await queryInterface.removeColumn('Contracts', 'paymentCycle');
  },
};
