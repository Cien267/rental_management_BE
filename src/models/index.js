const User = require('./user.model');
const Token = require('./token.model');
const Property = require('./property.model');
const Room = require('./room.model');
const Tenant = require('./tenant.model');
const Contract = require('./contract.model');
const UtilityMeter = require('./utilityMeter.model');
const UtilityMeterReading = require('./utilityMeterReading.model');
const ExtraFee = require('./extraFee.model');
const Invoice = require('./invoice.model');
const Payment = require('./payment.model');
const { sequelize } = require('../config/database');

// Existing associations
User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Ownership: User -> Properties
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Property -> Rooms
Property.hasMany(Room, { foreignKey: 'propertyId', as: 'rooms' });
Room.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Room -> Contracts
Room.hasMany(Contract, { foreignKey: 'roomId', as: 'contracts' });
Contract.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Tenant -> Contracts
Tenant.hasMany(Contract, { foreignKey: 'tenantId', as: 'contracts' });
Contract.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// Room -> Tenants
Room.hasMany(Tenant, { foreignKey: 'roomId', as: 'tenants' });
Tenant.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Property -> Tenants
Property.hasMany(Tenant, { foreignKey: 'propertyId', as: 'tenants' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Property/Room -> UtilityMeters
Property.hasMany(UtilityMeter, { foreignKey: 'propertyId', as: 'utilityMeters' });
UtilityMeter.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Room.hasMany(UtilityMeter, { foreignKey: 'roomId', as: 'utilityMeters' });
UtilityMeter.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// UtilityMeter -> UtilityMeterReadings
UtilityMeter.hasMany(UtilityMeterReading, { foreignKey: 'utilityMeterId', as: 'readings' });
UtilityMeterReading.belongsTo(UtilityMeter, { foreignKey: 'utilityMeterId', as: 'meter' });

// Property/Room -> UtilityMeterReadings
Property.hasMany(UtilityMeterReading, { foreignKey: 'propertyId', as: 'utilityMeterReadings' });
UtilityMeterReading.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Room.hasMany(UtilityMeterReading, { foreignKey: 'roomId', as: 'utilityMeterReadings' });
UtilityMeterReading.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Property -> ExtraFees
Property.hasMany(ExtraFee, { foreignKey: 'propertyId', as: 'extraFees' });
ExtraFee.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Contract -> Invoices
Contract.hasMany(Invoice, { foreignKey: 'contractId', as: 'invoices' });
Invoice.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

// Property -> Invoices
Property.hasMany(Invoice, { foreignKey: 'propertyId', as: 'invoices' });
Invoice.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Room -> Invoices
Room.hasMany(Invoice, { foreignKey: 'roomId', as: 'invoices' });
Invoice.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Invoice -> Payments
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

module.exports = {
  User,
  Token,
  Property,
  Room,
  Tenant,
  Contract,
  UtilityMeter,
  UtilityMeterReading,
  ExtraFee,
  Invoice,
  Payment,
  sequelize,
};
