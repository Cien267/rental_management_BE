module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Contracts', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rentAmount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      electricityUsed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      waterUsed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('unpaid', 'paid', 'overdue'),
        defaultValue: 'unpaid',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Invoices', {
      fields: ['contractId', 'month', 'year'],
      type: 'unique',
      name: 'unique_contract_month_year',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invoices');
  },
};
