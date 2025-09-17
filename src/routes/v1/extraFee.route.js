const express = require('express');
const validate = require('../../middlewares/validate');
const extraFeeValidation = require('../../validations/extraFee.validation');
const extraFeeController = require('../../controllers/extraFee.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(extraFeeValidation.createExtraFee), extraFeeController.createExtraFee)
  .get(validate(extraFeeValidation.getExtraFees), extraFeeController.getExtraFees);

router
  .route('/:extraFeeId')
  .get(validate(extraFeeValidation.getExtraFee), extraFeeController.getExtraFee)
  .patch(validate(extraFeeValidation.updateExtraFee), extraFeeController.updateExtraFee)
  .delete(validate(extraFeeValidation.deleteExtraFee), extraFeeController.deleteExtraFee);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ExtraFees
 *   description: Extra fee definitions per property
 */
/**
 * @swagger
 * /extra-fees:
 *   post:
 *     summary: Create an extra fee
 *     tags: [ExtraFees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List extra fees
 *     tags: [ExtraFees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /extra-fees/{extraFeeId}:
 *   get:
 *     summary: Get an extra fee
 *     tags: [ExtraFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: extraFeeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update an extra fee
 *     tags: [ExtraFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: extraFeeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete an extra fee
 *     tags: [ExtraFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: extraFeeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
