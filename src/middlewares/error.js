const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = err.errors.map((e) => e.message).join(', ');
      error = new ApiError(statusCode, message, false, err.stack);
    }
    // Handle Sequelize unique constraint errors
    else if (err.name === 'SequelizeUniqueConstraintError') {
      const statusCode = httpStatus.CONFLICT;
      const message = err.errors.map((e) => e.message).join(', ');
      error = new ApiError(statusCode, message, false, err.stack);
    }
    // Handle other Sequelize errors
    else if (err.name && err.name.startsWith('Sequelize')) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = err.message || 'Lỗi cơ sở dữ liệu';
      error = new ApiError(statusCode, message, false, err.stack);
    }
    // Handle other errors
    else {
      const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
