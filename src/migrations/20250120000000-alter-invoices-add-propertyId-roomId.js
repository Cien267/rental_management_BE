module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add propertyId column
    await queryInterface.addColumn('Invoices', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null initially for existing records
      references: {
        model: 'Properties',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add roomId column
    await queryInterface.addColumn('Invoices', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null initially for existing records
      references: {
        model: 'Rooms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('Invoices', ['propertyId']);
    await queryInterface.addIndex('Invoices', ['roomId']);
    await queryInterface.addIndex('Invoices', ['propertyId', 'roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('Invoices', ['propertyId', 'roomId']);
    await queryInterface.removeIndex('Invoices', ['roomId']);
    await queryInterface.removeIndex('Invoices', ['propertyId']);

    // Remove columns
    await queryInterface.removeColumn('Invoices', 'roomId');
    await queryInterface.removeColumn('Invoices', 'propertyId');
  },
};
