const Joi = require('joi');

const uploadImage = {
  body: Joi.object().keys({
    // Note: File validation is handled by multer middleware
    // This validation is for any additional fields that might be sent
  }),
};

const uploadMultipleImages = {
  body: Joi.object().keys({
    // Note: File validation is handled by multer middleware
    // This validation is for any additional fields that might be sent
  }),
};

const deleteImage = {
  params: Joi.object().keys({
    filename: Joi.string().required().messages({
      'string.empty': 'Filename is required',
      'any.required': 'Filename is required',
    }),
  }),
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
