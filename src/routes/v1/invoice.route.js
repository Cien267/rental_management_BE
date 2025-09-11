const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const invoiceValidation = require('../../validations/invoice.validation');
const invoiceController = require('../../controllers/invoice.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageInvoices'), validate(invoiceValidation.createInvoice), invoiceController.createInvoice)
  .get(auth('getInvoices'), validate(invoiceValidation.getInvoices), invoiceController.getInvoices);

router
  .route('/:invoiceId')
  .get(auth('getInvoices'), validate(invoiceValidation.getInvoice), invoiceController.getInvoice)
  .patch(auth('manageInvoices'), validate(invoiceValidation.updateInvoice), invoiceController.updateInvoice)
  .delete(auth('manageInvoices'), validate(invoiceValidation.deleteInvoice), invoiceController.deleteInvoice);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */
/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /invoices/{invoiceId}:
 *   get:
 *     summary: Get an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
