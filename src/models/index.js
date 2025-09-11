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

// Property/Room -> UtilityMeters
Property.hasMany(UtilityMeter, { foreignKey: 'propertyId', as: 'utilityMeters' });
UtilityMeter.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Room.hasMany(UtilityMeter, { foreignKey: 'roomId', as: 'utilityMeters' });
UtilityMeter.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// UtilityMeter -> UtilityMeterReadings
UtilityMeter.hasMany(UtilityMeterReading, { foreignKey: 'utilityMeterId', as: 'readings' });
UtilityMeterReading.belongsTo(UtilityMeter, { foreignKey: 'utilityMeterId', as: 'meter' });

// Property -> ExtraFees
Property.hasMany(ExtraFee, { foreignKey: 'propertyId', as: 'extraFees' });
ExtraFee.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Contract -> Invoices
Contract.hasMany(Invoice, { foreignKey: 'contractId', as: 'invoices' });
Invoice.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

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
