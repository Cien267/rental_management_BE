module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UtilityMeters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Rooms', key: 'id' },
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
      electricityPrev: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      electricityCurrent: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      waterPrev: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      waterCurrent: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.addConstraint('UtilityMeters', {
      fields: ['roomId', 'month', 'year'],
      type: 'unique',
      name: 'unique_room_month_year',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UtilityMeters');
  },
};
