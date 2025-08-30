#!/bin/bash

# QuizKnow Deployment Script
echo "🚀 Starting QuizKnow deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start the containers
echo "📦 Building and starting containers..."
docker-compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful! QuizKnow is running at http://localhost:5000"
    echo "📊 MongoDB is running at localhost:27017"
else
    echo "❌ Deployment failed. Check the logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment complete!"
