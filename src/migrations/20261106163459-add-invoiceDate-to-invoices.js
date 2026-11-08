/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột invoiceDate vào bảng Invoices
    await queryInterface.addColumn('Invoices', 'invoiceDate', {
      type: Sequelize.DATE, // Dùng DATE (DATETIME có giờ/phút/giây) hoặc Sequelize.DATEONLY nếu chỉ cần lưu ngày (YYYY-MM-DD)
      allowNull: true, // Cho phép null để an toàn đối với các hóa đơn cũ đã tạo
    });

    // Thêm index nếu bạn thường xuyên query/filter hóa đơn theo ngày tháng
    await queryInterface.addIndex('Invoices', ['invoiceDate']);
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Invoices');
    if (table.invoiceDate) {
      try {
        await queryInterface.removeIndex('Invoices', ['invoiceDate']);
      } catch (e) {}
      await queryInterface.removeColumn('Invoices', 'invoiceDate');
    }
  },
};
