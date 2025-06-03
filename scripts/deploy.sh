#!/bin/bash

# ==========================================
# 🚀 AUTHGUARD DEPLOYMENT SCRIPT
# ==========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_MIGRATION=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-migration)
            SKIP_MIGRATION=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment ENV    Set environment (default: production)"
            echo "  --skip-tests            Skip running tests"
            echo "  --skip-migration        Skip database migration"
            echo "  -h, --help              Show this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log "🚀 Starting AuthGuard deployment for environment: $ENVIRONMENT"

# Check if required files exist
log "📋 Checking prerequisites..."
if [[ ! -f ".env.$ENVIRONMENT" ]]; then
    error "Environment file .env.$ENVIRONMENT not found!"
    exit 1
fi

if [[ ! -f "docker/docker-compose.prod.yml" ]]; then
    error "Docker compose file not found!"
    exit 1
fi

success "Prerequisites check passed"

# Load environment variables
log "🔧 Loading environment variables..."
export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
success "Environment variables loaded"

# Run tests if not skipped
if [[ "$SKIP_TESTS" != true ]]; then
    log "🧪 Running tests..."
    npm run test:ci
    success "Tests passed"
else
    warning "Skipping tests"
fi

# Build Docker image
log "🐳 Building Docker image..."
docker build -f docker/Dockerfile.prod -t auth-guard:latest .
success "Docker image built successfully"

# Stop existing containers
log "🛑 Stopping existing containers..."
docker-compose -f docker/docker-compose.prod.yml down || true
success "Existing containers stopped"

# Start new containers
log "🚀 Starting new containers..."
docker-compose -f docker/docker-compose.prod.yml up -d

# Wait for database to be ready
log "⏳ Waiting for database to be ready..."
sleep 30

# Run database migrations if not skipped
if [[ "$SKIP_MIGRATION" != true ]]; then
    log "🗄️ Running database migrations..."
    docker-compose -f docker/docker-compose.prod.yml exec -T authguard-api npm run prisma:migrate:deploy
    success "Database migrations completed"
else
    warning "Skipping database migrations"
fi

# Health check
log "🏥 Performing health check..."
sleep 10

for i in {1..10}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        success "Health check passed"
        break
    fi
    
    if [[ $i -eq 10 ]]; then
        error "Health check failed after 10 attempts"
        log "📋 Container logs:"
        docker-compose -f docker/docker-compose.prod.yml logs authguard-api
        exit 1
    fi
    
    log "Health check attempt $i/10 failed, retrying in 5 seconds..."
    sleep 5
done

# Show container status
log "📊 Container status:"
docker-compose -f docker/docker-compose.prod.yml ps

success "🎉 Deployment completed successfully!"
log "🌐 AuthGuard is now running at http://localhost:3000"

# Cleanup old images
log "🧹 Cleaning up old Docker images..."
docker image prune -f
success "Cleanup completed"

log "✨ Deployment finished!" 