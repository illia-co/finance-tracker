#!/bin/bash

echo "🚀 Setting up Finance Tracker..."

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Copying environment file..."
    cp env.example .env
    echo "✅ Environment file created"
else
    echo "⚠️  Environment file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Start database
echo "🗄️  Starting PostgreSQL database..."
docker-compose up postgres -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma db push

# Seed database with test data
echo "🌱 Seeding database with test data..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  docker-compose up"
echo ""
echo "Or for development:"
echo "  npm run dev"
echo ""
echo "The application will be available at: http://localhost:3000"
