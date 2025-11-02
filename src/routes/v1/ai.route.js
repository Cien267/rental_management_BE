const express = require('express');
const auth = require('../../middlewares/auth');
const AIController = require('../../controllers/AI.controller');

const router = express.Router();

router.route('/extract-number').post(auth(), AIController.extractNumber);

module.exports = router;
