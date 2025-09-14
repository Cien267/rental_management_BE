const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      currentPassword: Joi.string(),
      newPassword: Joi.string().custom(password),
    })
    .min(1)
    .custom((value, helpers) => {
      // Ensure that if password change is attempted, both fields are provided
      if ((value.currentPassword && !value.newPassword) || (!value.currentPassword && value.newPassword)) {
        return helpers.error('any.custom', {
          message: 'Cần cung cấp cả mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu',
        });
      }
      return value;
    }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
