# Contributing to PasteBin Deluxe

First off, thank you for considering contributing to PasteBin Deluxe! 🎉

## 🤝 How to Contribute

### 🐛 Bug Reports

1. Check if the issue already exists in [GitHub Issues](https://github.com/saitama142/PasteBin_Deluxe/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, Docker version)

### 💡 Feature Requests

1. Open a [GitHub Discussion](https://github.com/saitama142/PasteBin_Deluxe/discussions) first
2. Describe the feature and its use case
3. Get community feedback before implementation

### 🔧 Pull Requests

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages
6. **Push** and create a Pull Request

## 📋 Development Guidelines

### Code Style
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Security First
- Never compromise security for features
- Sanitize all user inputs
- Follow secure coding practices
- Test for vulnerabilities

### Testing
- Add tests for new features
- Ensure existing tests pass
- Test in different environments
- Include security testing

## 🛠️ Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/PasteBin_Deluxe.git
cd PasteBin_Deluxe

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start development servers
npm run dev
```

## 📝 Commit Messages

Use clear, descriptive commit messages:

```
feat: add password strength indicator
fix: resolve XSS vulnerability in paste content
docs: update API documentation
style: improve mobile responsiveness
test: add security tests for input validation
```

## 🔍 Code Review Process

1. All submissions require review
2. Maintainers will review your PR
3. Address feedback promptly
4. Ensure CI checks pass
5. Squash commits if requested

## 📜 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Report any unacceptable behavior

## 🎉 Recognition

Contributors will be:
- Listed in the README acknowledgments
- Credited in release notes
- Given GitHub contributor badge

## 📞 Questions?

- Open a [Discussion](https://github.com/saitama142/PasteBin_Deluxe/discussions)
- Check existing [Issues](https://github.com/saitama142/PasteBin_Deluxe/issues)
- Read the [Documentation](#)

Thank you for contributing! 🚀
