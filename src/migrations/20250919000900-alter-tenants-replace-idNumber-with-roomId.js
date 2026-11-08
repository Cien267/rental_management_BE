module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop legacy idNumber column nếu tồn tại
    const table = await queryInterface.describeTable('Tenants');
    if (table.idNumber) {
      await queryInterface.removeColumn('Tenants', 'idNumber');
    }

    // 2. Tạo cột roomId thuần túy trước (bỏ 'references' để tránh gộp câu lệnh DDL)
    await queryInterface.addColumn('Tenants', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 3. Gắn ràng buộc Foreign Key riêng biệt sau khi cột đã tồn tại
    await queryInterface.addConstraint('Tenants', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'fk_tenants_roomId',
      references: {
        table: 'Rooms',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // 4. Thêm Index cho roomId
    await queryInterface.addIndex('Tenants', ['roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Tenants');

    // Xóa index, constraint và cột roomId
    if (table.roomId) {
      try {
        await queryInterface.removeIndex('Tenants', ['roomId']);
      } catch (e) {}
      try {
        await queryInterface.removeConstraint('Tenants', 'fk_tenants_roomId');
      } catch (e) {}
      await queryInterface.removeColumn('Tenants', 'roomId');
    }

    // Khôi phục lại idNumber
    if (!table.idNumber) {
      await queryInterface.addColumn('Tenants', 'idNumber', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }
  },
};
