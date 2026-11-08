/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invoices', 'month', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getMonth() + 1, // Đặt default phòng trường hợp đã có dữ liệu mẫu
    });

    await queryInterface.addColumn('Invoices', 'year', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear(),
    });

    // Thêm composite index để tối ưu việc tìm kiếm hóa đơn theo tháng/năm
    await queryInterface.addIndex('Invoices', ['year', 'month']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Invoices', ['year', 'month']);
    await queryInterface.removeColumn('Invoices', 'month');
    await queryInterface.removeColumn('Invoices', 'year');
  },
};
