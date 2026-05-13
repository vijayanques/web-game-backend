#!/bin/bash

# SEO BIGINT Fix - Automatic Migration Script
# This script applies the database migration to fix the entityId column

echo "🚀 Starting SEO BIGINT Migration..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

echo "📦 Running migration..."
node src/migrations/run-bigint-migration.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "The entityId column has been changed from INT to BIGINT."
    echo "You can now store large numeric IDs (like timestamps) in SEO metadata."
else
    echo ""
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
