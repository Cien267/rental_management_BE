module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add propertyId FK -> Properties.id
    await queryInterface.addColumn('Contracts', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true, // keep nullable for migration safety; app will enforce on create
      references: {
        model: 'Properties',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Contracts', ['propertyId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove propertyId
    const table = await queryInterface.describeTable('Contracts');
    if (table.propertyId) {
      await queryInterface.removeColumn('Contracts', 'propertyId');
    }
  },
};
