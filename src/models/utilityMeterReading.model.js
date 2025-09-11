const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UtilityMeterReading = sequelize.define(
  'UtilityMeterReading',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    utilityMeterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UtilityMeterReading;
