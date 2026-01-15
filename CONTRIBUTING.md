# Contributing to True BaZi Calculator

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bazi-calculator.git
   cd bazi-calculator
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Branch Naming
- `feature/` - New features (e.g., `feature/add-zodiac-compatibility`)
- `fix/` - Bug fixes (e.g., `fix/element-calculation-error`)
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add new symbolic star interpretations`
- `fix: correct Day Master strength calculation`
- `docs: update API configuration section`
- `refactor: simplify element balance algorithm`

## 🧪 Testing

Before submitting a PR:
1. Ensure the build passes:
   ```bash
   npm run build
   ```
2. Test your changes locally
3. Check for TypeScript errors

## 🎨 Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Add comments for complex logic

## 📁 Adding Famous People

To add new famous people to the database:

1. Edit `src/data/famousPeople.ts`
2. Add entries with verified birth data (Astro-Databank AA/A rated preferred)
3. Run the generation script:
   ```bash
   npx tsx scripts/generateFamousCharts.ts
   ```
4. Verify the new charts appear correctly

## 🔒 Security

- **Never commit API keys** or sensitive data
- Keep `.env.local` out of version control
- Report security vulnerabilities privately

## 📄 Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Request a review from maintainers
4. Address any feedback
5. Squash commits if requested

## 💬 Questions?

Open an issue for:
- Feature requests
- Bug reports
- General questions

Thank you for contributing! ☯
