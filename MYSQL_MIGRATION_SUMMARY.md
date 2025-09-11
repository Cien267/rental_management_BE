# MongoDB to MySQL Migration Summary

This document summarizes all the changes made to migrate the Node.js Express API from MongoDB/Mongoose to MySQL/Sequelize.

## Dependencies Changed

### Removed:

- `mongoose` - MongoDB ODM
- `express-mongo-sanitize` - MongoDB query sanitization

### Added:

- `mysql2` - MySQL driver for Node.js
- `sequelize` - SQL ORM for Node.js
- `sequelize-cli` - Sequelize command line interface

## Configuration Changes

### Environment Variables

Updated `src/config/config.js` to use MySQL configuration:

- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name

### Database Configuration

Created `src/config/database.js` with:

- Sequelize instance for application use
- Configuration object for Sequelize CLI
- Connection pooling settings
- Environment-specific configurations

## Model Changes

### User Model (`src/models/user.model.js`)

- Converted from Mongoose Schema to Sequelize Model
- Updated field types to use Sequelize DataTypes
- Added proper validation using Sequelize validators
- Implemented password hashing using Sequelize hooks
- Updated static methods to work with Sequelize

### Token Model (`src/models/token.model.js`)

- Converted from Mongoose Schema to Sequelize Model
- Updated foreign key relationship to use `userId`
- Added proper ENUM types for token types

### Model Associations (`src/models/index.js`)

- Defined Sequelize associations between User and Token models
- User hasMany Tokens
- Token belongsTo User

## Service Layer Changes

### User Service (`src/services/user.service.js`)

- Updated query methods to use Sequelize syntax
- Replaced Mongoose pagination with Sequelize findAndCountAll
- Updated CRUD operations to use Sequelize methods
- Changed ID type references from ObjectId to number

### Token Service (`src/services/token.service.js`)

- Updated token queries to use Sequelize where clauses
- Changed user reference from `user` to `userId`

### Auth Service (`src/services/auth.service.js`)

- Updated token operations to use Sequelize methods
- Changed user reference from `user` to `userId`
- Updated token deletion to use Sequelize destroy

## Application Changes

### Main Entry Point (`src/index.js`)

- Replaced Mongoose connection with Sequelize authentication
- Added database synchronization for development
- Updated error handling for database connection

### App Configuration (`src/app.js`)

- Removed MongoDB-specific middleware (mongoSanitize)
- Kept other security middleware intact

## Database Migration

### Migration Files

Created migration files in `src/migrations/`:

- `20240101000000-create-users.js` - Creates Users table
- `20240101000001-create-tokens.js` - Creates Tokens table with foreign key

### Seeder Files

Created seeder files in `src/seeders/`:

- `20240101000000-demo-user.js` - Adds demo user for testing

## Docker Configuration

### Docker Compose (`docker-compose.yml`)

- Replaced MongoDB service with MySQL service
- Updated environment variables for MySQL connection
- Changed volume mount from MongoDB data to MySQL data

## Package.json Updates

### Scripts Added:

- `db:migrate` - Run database migrations
- `db:migrate:undo` - Undo last migration
- `db:seed` - Run all seeders
- `db:seed:undo` - Undo all seeders
- `db:setup` - Complete database setup

## Setup Instructions

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create a `.env` file with MySQL configuration:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=password
   DB_NAME=rental_management
   ```

3. **Start MySQL Database:**

   ```bash
   docker-compose up mysql
   ```

4. **Run Database Setup:**

   ```bash
   npm run db:setup
   ```

5. **Start Application:**
   ```bash
   npm run dev
   ```

## Key Differences

### Data Types

- **MongoDB**: ObjectId, String, Number, Boolean, Date
- **MySQL**: INTEGER, STRING, BOOLEAN, DATE, ENUM

### Queries

- **Mongoose**: `User.findById(id)`
- **Sequelize**: `User.findByPk(id)`

### Pagination

- **Mongoose**: Custom paginate plugin
- **Sequelize**: `findAndCountAll` with limit/offset

### Associations

- **Mongoose**: Population with `populate()`
- **Sequelize**: Eager loading with `include`

### Validation

- **Mongoose**: Schema-level validation
- **Sequelize**: Model-level validation with validators

## Testing

The existing test suite should work with minimal changes, but you may need to:

1. Update test database configuration
2. Modify test data setup
3. Update assertions for different data types

## Benefits of Migration

1. **ACID Compliance**: MySQL provides full ACID transactions
2. **Schema Enforcement**: Strict schema validation
3. **Relationships**: Better foreign key constraints
4. **Performance**: Optimized for relational data
5. **Maturity**: More mature ecosystem for complex queries
6. **Tools**: Better tooling for database management

## Notes

- All existing API endpoints remain the same
- Authentication and authorization logic unchanged
- Error handling improved with better database constraints
- Migration maintains backward compatibility for API consumers
