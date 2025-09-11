module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop old UtilityMeters if exists (previous schema)
    const tableNames = await queryInterface.showAllTables();
    if (tableNames.includes('UtilityMeters')) {
      await queryInterface.dropTable('UtilityMeters');
    }

    // Create new UtilityMeters schema
    await queryInterface.createTable('UtilityMeters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Properties', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      meterType: {
        type: Sequelize.ENUM('electricity', 'water'),
        allowNull: false,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Rooms', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      unit: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'kWh',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UtilityMeters');
  },
};
