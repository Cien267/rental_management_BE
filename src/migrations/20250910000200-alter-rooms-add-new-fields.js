module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Rooms', 'amenities', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('Rooms', 'maxOccupants', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 });
    await queryInterface.addColumn('Rooms', 'currentOccupants', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Rooms', 'note', { type: Sequelize.TEXT, allowNull: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Rooms', 'amenities');
    await queryInterface.removeColumn('Rooms', 'maxOccupants');
    await queryInterface.removeColumn('Rooms', 'currentOccupants');
    await queryInterface.removeColumn('Rooms', 'note');
  },
};
