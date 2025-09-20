module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add propertyId FK -> Properties.id
    await queryInterface.addColumn('Tenants', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true, // keep nullable for migration safety; app will enforce on create
      references: {
        model: 'Properties',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Tenants', ['propertyId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove propertyId
    const table = await queryInterface.describeTable('Tenants');
    if (table.propertyId) {
      await queryInterface.removeColumn('Tenants', 'propertyId');
    }
  },
};
