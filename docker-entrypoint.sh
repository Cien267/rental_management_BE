#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
# Wait for MySQL to be available
until nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "MySQL is ready!"

echo "Creating database if it doesn't exist..."
# Create database if it doesn't exist
mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "Running database migrations..."
npm run db:migrate

echo "Starting application..."
exec node src/index.js