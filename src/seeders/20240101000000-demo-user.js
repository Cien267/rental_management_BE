const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 8);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Demo User',
          email: 'demo@example.com',
          password: hashedPassword,
          role: 'user',
          isEmailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'demo@example.com' }, {});
  },
};
