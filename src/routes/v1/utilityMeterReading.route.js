const express = require('express');
const validate = require('../../middlewares/validate');
const readingValidation = require('../../validations/utilityMeterReading.validation');
const readingController = require('../../controllers/utilityMeterReading.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(readingValidation.createReading), readingController.createReading)
  .get(validate(readingValidation.getReadings), readingController.getReadings);

router
  .route('/:readingId')
  .get(validate(readingValidation.getReading), readingController.getReading)
  .patch(validate(readingValidation.updateReading), readingController.updateReading)
  .delete(validate(readingValidation.deleteReading), readingController.deleteReading);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UtilityMeterReadings
 *   description: Meter reading values
 */
/**
 * @swagger
 * /utility-meter-readings:
 *   post:
 *     summary: Create a utility meter reading
 *     tags: [UtilityMeterReadings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List utility meter readings
 *     tags: [UtilityMeterReadings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /utility-meter-readings/{readingId}:
 *   get:
 *     summary: Get a utility meter reading
 *     tags: [UtilityMeterReadings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readingId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a utility meter reading
 *     tags: [UtilityMeterReadings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readingId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a utility meter reading
 *     tags: [UtilityMeterReadings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readingId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
