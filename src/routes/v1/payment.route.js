const express = require('express');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(paymentValidation.createPayment), paymentController.createPayment)
  .get(validate(paymentValidation.getPayments), paymentController.getPayments);

router
  .route('/:paymentId')
  .get(validate(paymentValidation.getPayment), paymentController.getPayment)
  .patch(validate(paymentValidation.updatePayment), paymentController.updatePayment)
  .delete(validate(paymentValidation.deletePayment), paymentController.deletePayment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */
/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     summary: Get a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
