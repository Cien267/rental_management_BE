const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contractValidation = require('../../validations/contract.validation');
const contractController = require('../../controllers/contract.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageContracts'), validate(contractValidation.createContract), contractController.createContract)
  .get(auth('getContracts'), validate(contractValidation.getContracts), contractController.getContracts);

router
  .route('/:contractId')
  .get(auth('getContracts'), validate(contractValidation.getContract), contractController.getContract)
  .patch(auth('manageContracts'), validate(contractValidation.updateContract), contractController.updateContract)
  .delete(auth('manageContracts'), validate(contractValidation.deleteContract), contractController.deleteContract);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: Contract management
 */
/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Create a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId: { type: integer }
 *               tenantId: { type: integer }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               depositAmount: { type: number, format: float }
 *               paymentCycle: { type: string, enum: [monthly, quarterly, yearly] }
 *               status: { type: string, enum: [active, ended, cancelled] }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List contracts
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /contracts/{contractId}:
 *   get:
 *     summary: Get a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId: { type: integer }
 *               tenantId: { type: integer }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               depositAmount: { type: number, format: float }
 *               paymentCycle: { type: string, enum: [monthly, quarterly, yearly] }
 *               status: { type: string, enum: [active, ended, cancelled] }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
