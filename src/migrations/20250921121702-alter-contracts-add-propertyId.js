module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Thêm cột propertyId thuần túy trước
    await queryInterface.addColumn('Contracts', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Gắn ràng buộc Foreign Key sau khi cột đã tồn tại
    await queryInterface.addConstraint('Contracts', {
      fields: ['propertyId'],
      type: 'foreign key',
      name: 'fk_contracts_propertyId',
      references: {
        table: 'Properties',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // 3. Thêm index cho cột propertyId
    await queryInterface.addIndex('Contracts', ['propertyId']);
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Contracts');
    if (table.propertyId) {
      try {
        await queryInterface.removeIndex('Contracts', ['propertyId']);
      } catch (e) {}
      try {
        await queryInterface.removeConstraint('Contracts', 'fk_contracts_propertyId');
      } catch (e) {}
      await queryInterface.removeColumn('Contracts', 'propertyId');
    }
  },
};
