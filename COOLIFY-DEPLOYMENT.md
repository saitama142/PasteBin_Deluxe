# Coolify Deployment Guide

Complete guide for deploying PasteBin Deluxe on Coolify with custom domain.

## Prerequisites

- Coolify instance running
- Domain name (e.g., bruphoria.xyz)
- DNS access (Namecheap, Cloudflare, etc.)

## Step 1: DNS Configuration

### For Subdomain (pastbin.bruphoria.xyz)
```
Type: A
Name: pastbin
Value: [Your Coolify Server IP]
TTL: Auto/300
```

### For Root Domain (bruphoria.xyz)
```
Type: A
Name: @
Value: [Your Coolify Server IP]
TTL: Auto/300
```

## Step 2: Coolify Project Setup

### 1. Create New Project
- Go to Coolify dashboard
- Click "New Project"
- Name: `pastebin-deluxe`

### 2. Add Application
- Click "New Application"
- Select "Docker Compose"
- Repository: `https://github.com/saitama142/PasteBin_Deluxe`
- Branch: `main`
- Docker Compose file: `docker-compose.prod.yml`

### 3. Environment Variables
```bash
# Required
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-NOW
DOMAIN=pastbin.bruphoria.xyz
ACME_EMAIL=your@email.com

# Optional (Recommended)
ALLOWED_ORIGINS=https://pastbin.bruphoria.xyz
BCRYPT_ROUNDS=12
MAX_PASTES_PER_IP=10
RATE_LIMIT_WINDOW=15
MAX_PASTE_SIZE=1048576

# Ports
FRONTEND_PORT=80
BACKEND_PORT=3001
```

### 4. Domain Configuration
- Domain: `pastbin.bruphoria.xyz`
- SSL: Enable (Let's Encrypt auto)
- Force HTTPS: Yes

## Step 3: Deploy

1. **Save Configuration**
2. **Click Deploy**
3. **Wait for build** (~3-5 minutes)
4. **Verify deployment** in logs

## Step 4: Verification

### Check Application
```bash
# Health check
curl https://pastbin.bruphoria.xyz/api/health

# Should return:
{"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### Test Features
1. Visit https://pastbin.bruphoria.xyz
2. Create a test paste
3. Verify syntax highlighting
4. Test password protection
5. Check expiration settings

## Troubleshooting

### Common Issues

**Build Failed**
- Check environment variables
- Verify repository access
- Check Coolify logs

**Domain Not Working**
- Verify DNS propagation: `nslookup pastbin.bruphoria.xyz`
- Check domain configuration in Coolify
- Ensure port 80/443 are open

**SSL Certificate Issues**
- Wait for Let's Encrypt (can take 5-10 minutes)
- Check email validation
- Verify domain ownership

### Log Access
```bash
# In Coolify dashboard
Applications → PasteBin Deluxe → Logs
```

## Production Optimizations

### Security
- Change default `JWT_SECRET`
- Set appropriate rate limits
- Configure allowed origins
- Enable monitoring

### Performance
- Adjust resource limits in Coolify
- Enable Docker healthchecks
- Set up backup strategy

### Monitoring
- Enable Coolify monitoring
- Set up alerts
- Configure log retention

## Backup Strategy

### Database Backup
```bash
# SQLite database location (in container)
/app/data/pastes.db

# Backup command
docker exec container_name cp /app/data/pastes.db /backup/
```

### Volume Mounting
Ensure data persistence by mounting:
```yaml
volumes:
  - pastebin_data:/app/data
```

## Updates

### Via Coolify
1. Go to application
2. Click "Redeploy"
3. Coolify will pull latest code and rebuild

### Manual Update
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Support

- 📖 Main README: [README.md](README.md)
- 🚀 Quick Start: [QUICKSTART.md](QUICKSTART.md)
- 🐛 Issues: GitHub Issues tab
- 💬 Coolify Docs: [coolify.io/docs](https://coolify.io/docs)

---

**Your PasteBin will be live at:** `https://pastbin.bruphoria.xyz` 🎉
