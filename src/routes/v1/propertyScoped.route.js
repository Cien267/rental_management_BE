const express = require('express');
const validate = require('../../middlewares/validate');
const roomValidation = require('../../validations/room.validation');
const tenantValidation = require('../../validations/tenant.validation');
const contractValidation = require('../../validations/contract.validation');
const extraFeeValidation = require('../../validations/extraFee.validation');
const invoiceValidation = require('../../validations/invoice.validation');
const roomController = require('../../controllers/room.controller');
const tenantController = require('../../controllers/tenant.controller');
const contractController = require('../../controllers/contract.controller');
const extraFeeController = require('../../controllers/extraFee.controller');
const invoiceController = require('../../controllers/invoice.controller');

const router = express.Router({ mergeParams: true });

// Inject propertyId into query for list endpoints
const injectPropertyIdToQuery = (req, res, next) => {
  req.query = { ...req.query, propertyId: parseInt(req.params.propertyId, 10) };
  next();
};

// Rooms
router
  .route('/:propertyId/rooms')
  .post(validate(roomValidation.createRoom), (req, res, next) => {
    req.body.propertyId = parseInt(req.params.propertyId, 10);
    return roomController.createRoom(req, res, next);
  })
  .get(injectPropertyIdToQuery, validate(roomValidation.getRooms), roomController.getRooms);

router
  .route('/:propertyId/rooms/:roomId')
  .get(validate(roomValidation.getRoom), roomController.getRoom)
  .patch(validate(roomValidation.updateRoom), roomController.updateRoom)
  .delete(validate(roomValidation.deleteRoom), roomController.deleteRoom);

// Tenants (scoped via contracts->rooms of property)
router
  .route('/:propertyId/tenants')
  .get(validate(tenantValidation.getTenants), (req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return tenantController.getTenants(req, res, next);
  })
  .post(validate(tenantValidation.createTenant), tenantController.createTenant);

router
  .route('/:propertyId/tenants/:tenantId')
  .get(validate(tenantValidation.getTenant), tenantController.getTenant)
  .patch(validate(tenantValidation.updateTenant), tenantController.updateTenant)
  .delete(validate(tenantValidation.deleteTenant), tenantController.deleteTenant);

// Contracts (room must belong to property in controllers/services checks later)
router
  .route('/:propertyId/contracts')
  .get(validate(contractValidation.getContracts), (req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return contractController.getContracts(req, res, next);
  })
  .post(validate(contractValidation.createContract), contractController.createContract);

router
  .route('/:propertyId/contracts/:contractId')
  .get(validate(contractValidation.getContract), contractController.getContract)
  .patch(validate(contractValidation.updateContract), contractController.updateContract)
  .delete(validate(contractValidation.deleteContract), contractController.deleteContract);

// Extra Fees
router
  .route('/:propertyId/extra-fees')
  .get(validate(extraFeeValidation.getExtraFees), (req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return extraFeeController.getExtraFees(req, res, next);
  })
  .post(validate(extraFeeValidation.createExtraFee), (req, res, next) => {
    req.body.propertyId = parseInt(req.params.propertyId, 10);
    return extraFeeController.createExtraFee(req, res, next);
  });

router
  .route('/:propertyId/extra-fees/:extraFeeId')
  .get(validate(extraFeeValidation.getExtraFee), extraFeeController.getExtraFee)
  .patch(validate(extraFeeValidation.updateExtraFee), extraFeeController.updateExtraFee)
  .delete(validate(extraFeeValidation.deleteExtraFee), extraFeeController.deleteExtraFee);

// Invoices
router
  .route('/:propertyId/invoices')
  .get(validate(invoiceValidation.getInvoices), (req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return invoiceController.getInvoices(req, res, next);
  })
  .post(validate(invoiceValidation.createInvoice), invoiceController.createInvoice);

router
  .route('/:propertyId/invoices/:invoiceId')
  .get(validate(invoiceValidation.getInvoice), invoiceController.getInvoice)
  .patch(validate(invoiceValidation.updateInvoice), invoiceController.updateInvoice)
  .delete(validate(invoiceValidation.deleteInvoice), invoiceController.deleteInvoice);

module.exports = router;
