const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExtraFee = sequelize.define(
  'ExtraFee',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    chargeType: {
      type: DataTypes.ENUM('monthly', 'one_time'),
      allowNull: false,
      defaultValue: 'monthly',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ExtraFee;
