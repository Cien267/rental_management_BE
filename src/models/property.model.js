const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define(
  'Property',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    floors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contactMail: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    electricityPricePerKwh: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    waterPricePerM3: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Property;
