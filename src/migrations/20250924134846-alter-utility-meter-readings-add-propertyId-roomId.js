module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add propertyId FK -> Properties.id
    await queryInterface.addColumn('UtilityMeterReadings', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true, // keep nullable for migration safety; app will enforce on create
      references: {
        model: 'Properties',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('UtilityMeterReadings', ['propertyId']);

    await queryInterface.addColumn('UtilityMeterReadings', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true, // keep nullable for migration safety; app will enforce on create
      references: {
        model: 'Rooms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('UtilityMeterReadings', ['roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove propertyId
    const table = await queryInterface.describeTable('UtilityMeterReadings');
    if (table.propertyId) {
      await queryInterface.removeColumn('UtilityMeterReadings', 'propertyId');
      await queryInterface.removeColumn('UtilityMeterReadings', 'roomId');
    }
  },
};
