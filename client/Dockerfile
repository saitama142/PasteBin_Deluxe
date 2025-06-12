# Multi-stage build for React frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL=/api

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (exclude node_modules via .dockerignore)
COPY . .

# Set environment variable from build arg
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Debug: Show environment variables
RUN echo "Build environment: REACT_APP_API_URL=$REACT_APP_API_URL"

# Debug: List copied files
RUN echo "Files copied to container:" && find . -type f -name "*.html" || echo "No HTML files found"
RUN echo "Public directory contents:" && ls -la public/ || echo "Public directory not found"

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Security: Use existing nginx user from base image
# The nginx:alpine image already has nginx user and group

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Security: Update packages
RUN apk update && apk upgrade && \
    apk del --purge && \
    rm -rf /var/cache/apk/*

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
