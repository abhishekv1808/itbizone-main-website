#!/bin/bash

# ITBIZONE AWS Deployment Script
# This script helps deploy the application to AWS EC2 instance

echo "==================================="
echo "ITBIZONE AWS Deployment Helper"
echo "==================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your MongoDB URI and secrets"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found. Installing PM2 globally..."
    sudo npm install -g pm2
fi

# Stop existing PM2 process if running
echo "🛑 Stopping existing application..."
pm2 stop itbizone-website 2>/dev/null || true

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Setting up PM2 startup script..."
pm2 startup

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 View logs: pm2 logs"
echo "📈 Monitor: pm2 monit"
echo "🔄 Restart: pm2 restart itbizone-website"
echo "🛑 Stop: pm2 stop itbizone-website"
echo ""
