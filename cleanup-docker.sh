#!/bin/bash

# Script để cleanup Docker và giải phóng dung lượng

echo "🧹 Bắt đầu cleanup Docker..."

# Stop và remove containers
echo "🛑 Stopping containers..."
docker-compose down 2>/dev/null || true

# Remove old images
echo "🗑️  Removing old images..."
docker image prune -f

# Remove unused volumes
echo "🗑️  Removing unused volumes..."
docker volume prune -f

# Remove build cache (giải phóng nhiều dung lượng nhất)
echo "🗑️  Removing build cache..."
docker builder prune -f

# Show disk usage
echo "📊 Docker disk usage:"
docker system df

echo "✅ Cleanup hoàn tất!"

