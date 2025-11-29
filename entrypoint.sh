#!/bin/sh

echo "🚀 Running Drizzle migration..."
bun db:migrate || echo "⚠️ Migration failed, continuing anyway"

echo "✅ Starting App Name..."
exec ./app-name
