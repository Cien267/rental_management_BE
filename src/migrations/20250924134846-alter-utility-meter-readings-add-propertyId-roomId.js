module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Tạo các cột thuần túy trước (bỏ references)
    await queryInterface.addColumn('UtilityMeterReadings', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('UtilityMeterReadings', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Gắn ràng buộc Foreign Key sau khi các cột đã tồn tại trên bảng
    await queryInterface.addConstraint('UtilityMeterReadings', {
      fields: ['propertyId'],
      type: 'foreign key',
      name: 'fk_utilitymeterreadings_propertyId',
      references: {
        table: 'Properties',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('UtilityMeterReadings', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'fk_utilitymeterreadings_roomId',
      references: {
        table: 'Rooms',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // 3. Thêm indexes cho các cột
    await queryInterface.addIndex('UtilityMeterReadings', ['propertyId']);
    await queryInterface.addIndex('UtilityMeterReadings', ['roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('UtilityMeterReadings');

    // Xóa index và constraint trước khi xóa cột
    if (table.propertyId) {
      try {
        await queryInterface.removeIndex('UtilityMeterReadings', ['propertyId']);
      } catch (e) {}
      try {
        await queryInterface.removeConstraint('UtilityMeterReadings', 'fk_utilitymeterreadings_propertyId');
      } catch (e) {}
      await queryInterface.removeColumn('UtilityMeterReadings', 'propertyId');
    }

    if (table.roomId) {
      try {
        await queryInterface.removeIndex('UtilityMeterReadings', ['roomId']);
      } catch (e) {}
      try {
        await queryInterface.removeConstraint('UtilityMeterReadings', 'fk_utilitymeterreadings_roomId');
      } catch (e) {}
      await queryInterface.removeColumn('UtilityMeterReadings', 'roomId');
    }
  },
};
