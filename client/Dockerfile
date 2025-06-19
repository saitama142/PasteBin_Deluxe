# Multi-stage build for React frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
COPY public public/

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Security: Use existing nginx user (100:101 in alpine)
USER nginx

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Inject Umami analytics if configured
RUN if [ -n "$UMAMI_URL" ] && [ -n "$UMAMI_WEBSITE_ID" ]; then \
    sed -i '/<head>/a \ \ <script defer src="'"$UMAMI_URL"'" data-website-id="'"$UMAMI_WEBSITE_ID"'"></script>' /usr/share/nginx/html/index.html; \
fi

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
