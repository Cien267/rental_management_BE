const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tenant = sequelize.define(
  'Tenant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    permanentAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nationalIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    emergencyContactName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergencyContactRelation: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Tenant;
