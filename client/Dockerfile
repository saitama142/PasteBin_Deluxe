FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Accept build arguments for API URL and Umami
ARG REACT_APP_API_URL
ARG UMAMI_URL
ARG UMAMI_WEBSITE_ID
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React app
RUN npm run build

# Inject Umami script if environment variables are provided
RUN if [ -n "$UMAMI_URL" ] && [ -n "$UMAMI_WEBSITE_ID" ]; then \
    sed -i "s|</head>|<script defer src=\"$UMAMI_URL\" data-website-id=\"$UMAMI_WEBSITE_ID\"></script></head>|" build/index.html; \
    fi

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx temp directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d

EXPOSE 80
USER nginx
