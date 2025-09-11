const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define(
  'Room',
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
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    area: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
      defaultValue: 'available',
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    maxOccupants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    currentOccupants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Room;
