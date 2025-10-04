module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove old unique constraint (if exists)
    try {
      await queryInterface.removeConstraint('Invoices', 'unique_contract_month_year');
    } catch (e) {}

    // Add new columns
    await queryInterface.addColumn('Invoices', 'invoiceDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_DATE'),
    });
    await queryInterface.addColumn('Invoices', 'periodStart', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_DATE'),
    });
    await queryInterface.addColumn('Invoices', 'periodEnd', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_DATE'),
    });
    await queryInterface.changeColumn('Invoices', 'rentAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Invoices', 'utilitiesAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Invoices', 'extraFeesAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Invoices', 'notes', { type: Sequelize.TEXT, allowNull: true });

    await queryInterface.addColumn('Invoices', 'totalAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    });

    // Update status enum to include 'partially_paid'
    await queryInterface.changeColumn('Invoices', 'status', {
      type: Sequelize.ENUM('unpaid', 'partially_paid', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'unpaid',
    });

    // Remove legacy columns
    const legacyCols = ['month', 'year', 'electricityUsed', 'waterUsed'];
    for (const col of legacyCols) {
      try {
        await queryInterface.removeColumn('Invoices', col);
      } catch (e) {}
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Try to reverse changes (best-effort)
    await queryInterface.addColumn('Invoices', 'month', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Invoices', 'year', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Invoices', 'electricityUsed', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Invoices', 'waterUsed', { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 });
    try {
      await queryInterface.removeColumn('Invoices', 'totalAmount');
    } catch (e) {}
    await queryInterface.addColumn('Invoices', 'totalAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.removeColumn('Invoices', 'invoiceDate');
    await queryInterface.removeColumn('Invoices', 'periodStart');
    await queryInterface.removeColumn('Invoices', 'periodEnd');
    await queryInterface.removeColumn('Invoices', 'utilitiesAmount');
    await queryInterface.removeColumn('Invoices', 'extraFeesAmount');
    await queryInterface.removeColumn('Invoices', 'notes');

    await queryInterface.changeColumn('Invoices', 'status', {
      type: Sequelize.ENUM('unpaid', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'unpaid',
    });
  },
};
