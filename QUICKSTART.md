# Quick Start Guide

## For Beginners (Docker - Recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/saitama142/PasteBin_Deluxe.git
cd PasteBin_Deluxe
```

### 2. Quick Setup (2 minutes)
```bash
# Copy environment file
cp .env.production .env

# Edit with your domain (optional for local testing)
nano .env

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Access Your Pastebin
- **Local**: http://localhost
- **Your Domain**: https://yourdomain.com

## For Developers (Build from Source)

### Backend
```bash
cd server
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

## Environment Configuration

### Required Variables
```bash
JWT_SECRET=your-super-secret-key-here
DOMAIN=yourdomain.com
ACME_EMAIL=your@email.com
```

### Optional Variables
```bash
MAX_PASTES_PER_IP=10          # Rate limiting
RATE_LIMIT_WINDOW=15          # Minutes
BCRYPT_ROUNDS=12              # Password strength
```

## Deployment Platforms

### Coolify
1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy with Docker Compose

### Other Platforms
- Works with any Docker-compatible platform
- Supports Nginx Proxy Manager
- Compatible with Traefik, Caddy, etc.

## Features

- ✅ Secure password protection
- ✅ Syntax highlighting (20+ languages)
- ✅ Auto-expiration (1h, 1d, 1w, never)
- ✅ Dark/light themes
- ✅ Mobile responsive
- ✅ Rate limiting
- ✅ XSS protection
- ✅ Easy self-hosting

## Support

- 📚 Full documentation in README.md
- 🐛 Issues: GitHub Issues
- 🔒 Security: Built-in multi-layer protection
