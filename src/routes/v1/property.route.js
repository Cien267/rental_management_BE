const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const propertyValidation = require('../../validations/property.validation');
const propertyController = require('../../controllers/property.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageProperties'), validate(propertyValidation.createProperty), propertyController.createProperty)
  .get(auth('getProperties'), validate(propertyValidation.getProperties), propertyController.getProperties);

router
  .route('/:propertyId')
  .get(auth('getProperties'), validate(propertyValidation.getProperty), propertyController.getProperty)
  .patch(auth('manageProperties'), validate(propertyValidation.updateProperty), propertyController.updateProperty)
  .delete(auth('manageProperties'), validate(propertyValidation.deleteProperty), propertyController.deleteProperty);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management
 */
/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, name]
 *             properties:
 *               userId: { type: integer }
 *               name: { type: string }
 *               address: { type: string }
 *               type: { type: string }
 *               floors: { type: integer }
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: List properties
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
/**
 * @swagger
 * /properties/{propertyId}:
 *   get:
 *     summary: Get a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No Content
 */
