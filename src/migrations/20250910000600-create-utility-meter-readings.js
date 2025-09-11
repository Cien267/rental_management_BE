module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UtilityMeterReadings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      utilityMeterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UtilityMeters', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      readingDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(12, 2),
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
    await queryInterface.dropTable('UtilityMeterReadings');
  },
};
