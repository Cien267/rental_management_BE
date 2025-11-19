#!/bin/sh
set -e
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

# Create database if it doesn't exist
mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
npm run db:migrate
exec node src/index.js