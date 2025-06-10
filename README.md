![image](https://github.com/user-attachments/assets/10bbdf0b-3580-4403-819d-9272b46a5e87)


<div align="center">

# 🚀 PasteBin Deluxe

### A secure, modern, and feature-rich pastebin application

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub stars](https://img.shields.io/github/stars/saitama142/PasteBin_Deluxe?style=social)](https://github.com/saitama142/PasteBin_Deluxe/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/saitama142/PasteBin_Deluxe?style=social)](https://github.com/saitama142/PasteBin_Deluxe/network/members)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/saitama142/PasteBin_Deluxe)

**Perfect for self-hosting and sharing code snippets, text, or any content with enterprise-level security and a beautiful user interface.**


</div>

---

## ✨ Features

### 🎨 **User Experience**
- **Modern Design** - Clean, Apple-inspired interface with glassmorphism effects
- **Dark/Light Themes** - Beautiful themes with smooth transitions
- **Responsive** - Optimized for desktop, tablet, and mobile devices
- **Syntax Highlighting** - Support for 20+ programming languages with auto-detection
- **Fast Loading** - Optimized performance with efficient caching

### 🔒 **Security Features**
- **XSS Protection** - Multi-layer content sanitization with DOMPurify
- **Rate Limiting** - IP-based request throttling to prevent abuse
- **Password Protection** - bcrypt encrypted passwords for sensitive pastes
- **Secure Headers** - Comprehensive security headers via Helmet.js
- **Input Validation** - Server-side validation for all inputs
- **Container Security** - Hardened Docker setup with security constraints

### ⚡ **Core Functionality**
- **Easy Paste Creation** - Simple interface for pasting text or code
- **Expiration Control** - Set pastes to expire after 1 hour, 1 day, 1 week, or never
- **Unique URLs** - Cryptographically secure shareable URLs
- **Delete Management** - Secure paste deletion with delete tokens
- **Copy Functions** - Easy URL copying and content downloading

---

## 🚀 Quick Start

### 🐳 **Docker (Recommended)**

```bash
git clone https://github.com/saitama142/PasteBin_Deluxe.git
cd PasteBin_Deluxe
cp .env.production .env
nano .env  # Edit with your settings
docker-compose -f docker-compose.prod.yml up -d
```

### 💻 **Development Setup**

```bash
git clone https://github.com/saitama142/PasteBin_Deluxe.git
cd PasteBin_Deluxe

# Backend
cd server && npm install && cp .env.example .env && npm start

# Frontend (new terminal)
cd ../client && npm install && npm start
```

**Access:** Frontend: http://localhost:3000 | API: http://localhost:3001

---

## ⚙️ Configuration

### 🔧 **Environment Variables**

```bash
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12
DATABASE_PATH=./data/pastes.db
MAX_PASTES_PER_IP=10
RATE_LIMIT_WINDOW=15
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📚 API Examples

### 📝 **Create Paste**
```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World", "language": "javascript", "expiration": "1day"}'
```

### 📖 **Get Paste**
```bash
curl http://localhost:3001/api/pastes/PASTE_ID
```

---

## 🛡️ Security

- **Content Sanitization** - All user input sanitized to prevent XSS
- **Rate Limiting** - Configurable IP-based limits
- **Password Encryption** - bcrypt hashing for sensitive pastes
- **Secure Headers** - Full security header implementation
- **Container Hardening** - Minimal privileges and read-only filesystems

---

## 🔧 Technology Stack

- **Frontend:** React, Highlight.js, DOMPurify
- **Backend:** Node.js, Express, SQLite
- **Security:** Helmet.js, bcrypt, rate-limiting
- **Deployment:** Docker, Docker Compose, Nginx

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/amazing-feature`)
3. ✅ Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/saitama142/PasteBin_Deluxe/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/saitama142/PasteBin_Deluxe/discussions)

---

<div align="center">

### 🚀 **Ready to deploy your own PasteBin?**

**[⭐ Star this repo](https://github.com/saitama142/PasteBin_Deluxe)** • **[🍴 Fork it](https://github.com/saitama142/PasteBin_Deluxe/fork)**

---

*Created with 💜 by [Ouss](https://github.com/saitama142)*

</div>
