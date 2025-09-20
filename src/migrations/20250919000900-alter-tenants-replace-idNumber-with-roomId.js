module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop legacy idNumber column
    const table = await queryInterface.describeTable('Tenants');
    if (table.idNumber) {
      await queryInterface.removeColumn('Tenants', 'idNumber');
    }

    // Add roomId FK -> Rooms.id
    await queryInterface.addColumn('Tenants', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true, // keep nullable for migration safety; app will enforce on create
      references: {
        model: 'Rooms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Tenants', ['roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove roomId
    const table = await queryInterface.describeTable('Tenants');
    if (table.roomId) {
      await queryInterface.removeColumn('Tenants', 'roomId');
    }

    // Re-add idNumber
    await queryInterface.addColumn('Tenants', 'idNumber', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },
};
