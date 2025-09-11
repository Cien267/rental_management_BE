const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const utilityMeterValidation = require('../../validations/utilityMeter.validation');
const utilityMeterController = require('../../controllers/utilityMeter.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageUtilityMeters'),
    validate(utilityMeterValidation.createUtilityMeter),
    utilityMeterController.createUtilityMeter
  )
  .get(auth('getUtilityMeters'), validate(utilityMeterValidation.getUtilityMeters), utilityMeterController.getUtilityMeters);

router
  .route('/:utilityMeterId')
  .get(auth('getUtilityMeters'), validate(utilityMeterValidation.getUtilityMeter), utilityMeterController.getUtilityMeter)
  .patch(
    auth('manageUtilityMeters'),
    validate(utilityMeterValidation.updateUtilityMeter),
    utilityMeterController.updateUtilityMeter
  )
  .delete(
    auth('manageUtilityMeters'),
    validate(utilityMeterValidation.deleteUtilityMeter),
    utilityMeterController.deleteUtilityMeter
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UtilityMeters
 *   description: Utility meter registry (per property/room)
 */
/**
 * @swagger
 * /utility-meters:
 *   post:
 *     summary: Register a utility meter (electricity/water)
 *     tags: [UtilityMeters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: integer }
 *               roomId: { type: integer, nullable: true }
 *               meterType: { type: string, enum: [electricity, water] }
 *               active: { type: boolean }
 *               unit: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List utility meters
 *     tags: [UtilityMeters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /utility-meters/{utilityMeterId}:
 *   get:
 *     summary: Get a utility meter
 *     tags: [UtilityMeters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: utilityMeterId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a utility meter
 *     tags: [UtilityMeters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: utilityMeterId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: integer }
 *               roomId: { type: integer, nullable: true }
 *               meterType: { type: string, enum: [electricity, water] }
 *               active: { type: boolean }
 *               unit: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a utility meter
 *     tags: [UtilityMeters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: utilityMeterId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
