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
const utilityMeterValidation = require('../../validations/utilityMeter.validation');
const utilityMeterController = require('../../controllers/utilityMeter.controller');
const readingValidation = require('../../validations/utilityMeterReading.validation');
const readingController = require('../../controllers/utilityMeterReading.controller');

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

// Utility Meters (scoped by property)
router
  .route('/:propertyId/utility-meters')
  .post(validate(utilityMeterValidation.createUtilityMeter), (req, res, next) => {
    req.body.propertyId = parseInt(req.params.propertyId, 10);
    return utilityMeterController.createUtilityMeter(req, res, next);
  })
  .get((req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return utilityMeterController.getUtilityMeters(req, res, next);
  });

router
  .route('/:propertyId/utility-meters/:utilityMeterId')
  .get(validate(utilityMeterValidation.getUtilityMeter), utilityMeterController.getUtilityMeter)
  .patch(validate(utilityMeterValidation.updateUtilityMeter), utilityMeterController.updateUtilityMeter)
  .delete(validate(utilityMeterValidation.deleteUtilityMeter), utilityMeterController.deleteUtilityMeter);

// Utility Meter Readings (scoped by property and meter)
router
  .route('/:propertyId/utility-meters/:utilityMeterId/readings')
  .post(validate(readingValidation.createReading), (req, res, next) => {
    req.body.propertyId = parseInt(req.params.propertyId, 10);
    req.body.utilityMeterId = parseInt(req.params.utilityMeterId, 10);
    return readingController.createReading(req, res, next);
  })
  .get((req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    req.query.utilityMeterId = parseInt(req.params.utilityMeterId, 10);
    return readingController.getReadings(req, res, next);
  });

router
  .route('/:propertyId/utility-meters/:utilityMeterId/readings/:readingId')
  .get(validate(readingValidation.getReading), readingController.getReading)
  .patch(validate(readingValidation.updateReading), readingController.updateReading)
  .delete(validate(readingValidation.deleteReading), readingController.deleteReading);

// List all readings by property with optional filters in query
router
  .route('/:propertyId/utility-meters-readings')
  .get((req, res, next) => {
    req.query.propertyId = parseInt(req.params.propertyId, 10);
    return readingController.getReadings(req, res, next);
  });

module.exports = router;
