const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database.url, {
  dialect: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// For Sequelize CLI
module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: `${config.database.name}_test`,
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
  },
};

// For application use
module.exports.sequelize = sequelize;
