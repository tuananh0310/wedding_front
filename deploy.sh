#!/bin/bash

# Script để deploy/cập nhật ứng dụng trên Docker

set -e

echo "🚀 Bắt đầu deploy..."

# Build lại image với tag mới
echo "📦 Building Docker image..."
docker-compose build --no-cache

# Stop và remove container cũ
echo "🛑 Stopping old container..."
docker-compose down

# Start container mới
echo "▶️  Starting new container..."
docker-compose up -d

# Show logs
echo "📋 Container logs:"
docker-compose logs -f --tail=50

echo "✅ Deploy hoàn tất!"
echo "🌐 Ứng dụng đang chạy tại: http://localhost:9000"

