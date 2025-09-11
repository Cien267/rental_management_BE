const { DataTypes } = require('sequelize');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { roles } = require('../config/roles');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255],
        is: {
          args: /^(?=.*[a-zA-Z])(?=.*\d)/,
          msg: 'Password must contain at least one letter and one number',
        },
      },
    },
    role: {
      type: DataTypes.ENUM(roles),
      defaultValue: 'user',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
    },
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {number} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
User.isEmailTaken = async function (email, excludeUserId) {
  const whereClause = { email };
  if (excludeUserId) {
    whereClause.id = { [sequelize.Sequelize.Op.ne]: excludeUserId };
  }
  const user = await this.findOne({ where: whereClause });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
User.prototype.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
