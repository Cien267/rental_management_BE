module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Tạo các cột thuần túy trước (bỏ 'references' để không bị gộp lệnh DDL)
    await queryInterface.addColumn('Invoices', 'propertyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Thêm Foreign Key Constraints sau khi các cột đã tồn tại trên bảng
    await queryInterface.addConstraint('Invoices', {
      fields: ['propertyId'],
      type: 'foreign key',
      name: 'fk_invoices_propertyId',
      references: {
        table: 'Properties',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Invoices', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'fk_invoices_roomId',
      references: {
        table: 'Rooms',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // 3. Thêm composite index (khoá ngoại đơn đã tự động được index)
    await queryInterface.addIndex('Invoices', ['propertyId', 'roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa theo thứ tự ngược lại: Index -> Constraint -> Column
    await queryInterface.removeIndex('Invoices', ['propertyId', 'roomId']);
    await queryInterface.removeConstraint('Invoices', 'fk_invoices_propertyId');
    await queryInterface.removeConstraint('Invoices', 'fk_invoices_roomId');
    await queryInterface.removeColumn('Invoices', 'roomId');
    await queryInterface.removeColumn('Invoices', 'propertyId');
  },
};
