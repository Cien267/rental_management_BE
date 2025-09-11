const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const email = 'owner1@example.com';
    const passwordPlain = 'Password1!';
    const hashedPassword = await bcrypt.hash(passwordPlain, 8);

    // ensure idempotency: remove if exists then insert
    await queryInterface.bulkDelete('Users', { email }, {});

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Owner One',
          email,
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
    await queryInterface.bulkDelete('Users', { email: 'owner1@example.com' }, {});
  },
};
