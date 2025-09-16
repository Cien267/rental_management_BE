const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const propertyRoute = require('./property.route');
const roomRoute = require('./room.route');
const tenantRoute = require('./tenant.route');
const contractRoute = require('./contract.route');
const utilityMeterRoute = require('./utilityMeter.route');
const utilityMeterReadingRoute = require('./utilityMeterReading.route');
const extraFeeRoute = require('./extraFee.route');
const invoiceRoute = require('./invoice.route');
const paymentRoute = require('./payment.route');
const uploadRoute = require('./upload.route');
const propertyScopedRoute = require('./propertyScoped.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/properties',
    route: propertyRoute,
  },
  {
    path: '/rooms',
    route: roomRoute,
  },
  {
    path: '/tenants',
    route: tenantRoute,
  },
  {
    path: '/contracts',
    route: contractRoute,
  },
  {
    path: '/utility-meters',
    route: utilityMeterRoute,
  },
  {
    path: '/utility-meter-readings',
    route: utilityMeterReadingRoute,
  },
  {
    path: '/extra-fees',
    route: extraFeeRoute,
  },
  {
    path: '/invoices',
    route: invoiceRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/properties',
    route: propertyScopedRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
