const { sequelize } = require('../../src/config/database');
const config = require('../../src/config/config');

const setupTestDB = () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clear all tables
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
