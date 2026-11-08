module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Tạo cột propertyId thuần túy trước
    await queryInterface.addColumn('Tenants', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Gắn ràng buộc Foreign Key sau khi cột đã tồn tại
    await queryInterface.addConstraint('Tenants', {
      fields: ['propertyId'],
      type: 'foreign key',
      name: 'fk_tenants_propertyId',
      references: {
        table: 'Properties',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // 3. Thêm index cho cột propertyId
    await queryInterface.addIndex('Tenants', ['propertyId']);
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Tenants');
    if (table.propertyId) {
      try {
        await queryInterface.removeIndex('Tenants', ['propertyId']);
      } catch (e) {}
      try {
        await queryInterface.removeConstraint('Tenants', 'fk_tenants_propertyId');
      } catch (e) {}
      await queryInterface.removeColumn('Tenants', 'propertyId');
    }
  },
};
