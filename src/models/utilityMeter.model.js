const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UtilityMeter = sequelize.define(
  'UtilityMeter',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    meterType: {
      type: DataTypes.ENUM('electricity', 'water'),
      allowNull: false,
    },
    roomId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'kWh',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UtilityMeter;
