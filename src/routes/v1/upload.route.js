const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const uploadValidation = require('../../validations/upload.validation');
const uploadController = require('../../controllers/upload.controller');

const router = express.Router();

router.route('/image').post(auth(), validate(uploadValidation.uploadImage), uploadController.uploadImage);

router.route('/images').post(auth(), validate(uploadValidation.uploadMultipleImages), uploadController.uploadMultipleImages);

router.route('/image/:filename').delete(auth(), validate(uploadValidation.deleteImage), uploadController.deleteImage);

module.exports = router;
