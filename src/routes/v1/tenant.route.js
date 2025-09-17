const express = require('express');
const validate = require('../../middlewares/validate');
const tenantValidation = require('../../validations/tenant.validation');
const tenantController = require('../../controllers/tenant.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(tenantValidation.createTenant), tenantController.createTenant)
  .get(validate(tenantValidation.getTenants), tenantController.getTenants);

router
  .route('/:tenantId')
  .get(validate(tenantValidation.getTenant), tenantController.getTenant)
  .patch(validate(tenantValidation.updateTenant), tenantController.updateTenant)
  .delete(validate(tenantValidation.deleteTenant), tenantController.deleteTenant);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management
 */
/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantCreate'
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List tenants
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /tenants/{tenantId}:
 *   get:
 *     summary: Get a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantUpdate'
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
