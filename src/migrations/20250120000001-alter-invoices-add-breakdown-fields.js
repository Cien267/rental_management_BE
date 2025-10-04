module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add utilitiesBreakdown column
    await queryInterface.addColumn('Invoices', 'utilitiesBreakdown', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Add extraFeesBreakdown column
    await queryInterface.addColumn('Invoices', 'extraFeesBreakdown', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns
    await queryInterface.removeColumn('Invoices', 'extraFeesBreakdown');
    await queryInterface.removeColumn('Invoices', 'utilitiesBreakdown');
  },
};
