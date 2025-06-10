#!/bin/bash

# Secure deployment script for Pastebin application
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    error "Please do not run this script as root for security reasons"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

log "Starting secure deployment of Pastebin application..."

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    log "Creating environment file..."
    cp .env.production .env
    warn "Please edit .env file with your production values before proceeding!"
    warn "Especially change the JWT_SECRET and DOMAIN values!"
    read -p "Press enter to continue after editing .env file..."
fi

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Validate required environment variables
required_vars=("JWT_SECRET" "DOMAIN" "ACME_EMAIL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        error "Required environment variable $var is not set"
        exit 1
    fi
done

# Check if JWT_SECRET is still default
if [ "$JWT_SECRET" = "your-super-secure-jwt-secret-change-this-NOW" ]; then
    error "Please change the JWT_SECRET in .env file"
    exit 1
fi

# Create necessary directories
log "Creating directories..."
mkdir -p data logs

# Set proper permissions
log "Setting permissions..."
chmod 750 data logs

# Pull latest images
log "Pulling latest base images..."
docker-compose -f docker-compose.prod.yml pull

# Build images
log "Building application images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Stop existing containers if running
log "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start services
log "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
log "Waiting for services to be healthy..."
sleep 30

# Check health
log "Checking service health..."
for service in backend frontend reverse-proxy; do
    if docker-compose -f docker-compose.prod.yml ps | grep -q "${service}.*healthy"; then
        log "$service is healthy"
    else
        warn "$service may not be healthy. Check logs: docker-compose -f docker-compose.prod.yml logs $service"
    fi
done

# Security recommendations
log "Deployment complete!"
echo ""
log "Security recommendations:"
echo "1. Regularly update Docker images: docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
echo "2. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "3. Backup data directory regularly"
echo "4. Use a firewall to restrict access"
echo "5. Enable automatic security updates on your host"
echo "6. Consider using fail2ban for additional protection"
echo ""
log "Application should be available at: https://$DOMAIN"
log "Traefik dashboard available at: http://your-server-ip:8080"

# Show running containers
docker-compose -f docker-compose.prod.yml ps
