#!/bin/sh
set -e

# 1. Wait for the database to be ready
echo "Waiting for database..."
# Use node to check if db is reachable on port 5432
until node -e "require('net').connect(5432, 'db').on('connect', () => process.exit(0)).on('error', () => process.exit(1))"; do
  sleep 1
done
echo "Database is up."



# 4. Start the app
echo "Starting application..."
exec "$@"
