# Node.js Starter Kit 🚀

A production-ready Node.js starter kit with Express, TypeScript, Prisma, MySQL, comprehensive testing, and automated code generation.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2-green)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-blueviolet)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30-red)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

### Core Stack
- **TypeScript 5.9** - Type-safe development with latest features
- **Express 5.2** - Fast, minimalist web framework
- **Prisma 7** - Next-generation ORM with type safety
- **MySQL** - Reliable relational database
- **JWT** - Secure token-based authentication
- **RBAC** - Role-based access control with permissions

### Developer Experience
- **🎯 Code Generator** - Auto-generate CRUD modules with tests in seconds
- **📚 RESTful APIs** - Standard REST conventions (POST /, GET /, GET /:id, PUT /:id, DELETE /:id)
- **📖 Swagger UI** - Interactive API documentation at `/api-docs`
- **✅ ESLint 9** - Modern flat config with strict rules
- **💅 Prettier** - Consistent code formatting
- **🌍 i18n** - Multi-language support (English, Spanish)

### Testing & Performance
- **Jest 30** - Modern testing framework with great DX
- **Unit Tests** - Isolated tests with mocked dependencies
- **Integration Tests** - Full API endpoint testing with real database
- **Performance Tracking** - Color-coded benchmarking (🟢 Fast, 🟡 Acceptable, 🟠 Slow, 🔴 Very Slow)
- **Coverage Reports** - Detailed HTML reports with >80% coverage

## 📋 Quick Start

### Prerequisites

- Node.js 20+
- MySQL 8+ (or Docker)
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd node-starter-kit

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start MySQL (Docker)
docker-compose up -d

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:5000
# Swagger UI: http://localhost:5000/api-docs
```

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run unit tests only (fast, isolated)
npm run test:unit

# Run integration tests only (with database)
npm run test:integration

# Run all tests sequentially
npm run test:all

# Run tests for specific module (unit + integration)
npm run test:module user

# Run only unit tests for specific module
npm run test:unit:module user

# Watch mode
npm run test:watch
```

**💡 Pro Tips:**
- Use `test:module` to test a specific feature (e.g., `user`, `role`)
- Use `test:unit:module` for fast unit tests of a single module
- Pattern matching works: `npm run test:module role` runs all role-related tests

## 🔨 Code Generation

Generate complete CRUD modules with one command:

```bash
npm run generate
```

**What it generates:**
- ✅ Model class with TypeScript interfaces
- ✅ Service with CRUD operations + pagination
- ✅ Controller with RESTful endpoints
- ✅ Routes with authentication & validation
- ✅ Validators with i18n error messages
- ✅ Swagger documentation (schemas + paths)
- ✅ Unit tests (controller + service)
- ✅ Integration tests with performance tracking

**Example:** Generate a `Product` module in < 5 seconds with full test coverage!

📖 **Detailed guide:** [docs/CODE_GENERATION.md](docs/CODE_GENERATION.md)

## 📁 Project Structure

```
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma           # Prisma schema
│   ├── migrations/             # Database migrations
│   └── seeders/                # Seed data
├── src/
│   ├── config/                 # Configuration files
│   │   ├── swagger/           # API documentation
│   │   ├── locales/           # i18n translations
│   │   └── templates/         # Code generation templates
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── middlewares/            # Express middlewares
│   ├── validators/             # Request validation
│   ├── models/                 # Data models
│   ├── utils/                  # Utility functions
│   └── tests/                  # Test files
│       ├── unit/              # Unit tests
│       ├── integration/       # Integration tests
│       └── helpers/           # Test utilities
├── docs/                       # Documentation
│   ├── TESTING.md             # Testing guide
│   ├── BENCHMARKING.md        # Performance guide
│   └── CODE_GENERATION.md     # Generator guide
└── logs/                       # Application logs
    └── benchmark/             # Performance logs
```

**🔗 Full API docs:** http://localhost:5000/api-docs

## 🧰 Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality
```bash
npm run lint:check       # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run format:check     # Check code formatting
npm run format:fix       # Format code with Prettier
```

### Database
```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:deploy    # Deploy migrations (production)
npm run prisma:format    # Format schema.prisma
npm run seed             # Seed database
```

### Code Generation
```bash
npm run generate         # Generate CRUD module with tests
```

### Testing
```bash
npm test                      # Run all tests with coverage
npm run test:unit             # Run all unit tests
npm run test:integration      # Run all integration tests
npm run test:all              # Run unit then integration (sequential)
npm run test:module <name>    # Run all tests for specific module
npm run test:unit:module <name>  # Run unit tests for specific module
npm run test:watch            # Watch mode for development
```

**Examples:**
```bash
npm run test:module user           # All user tests (unit + integration)
npm run test:unit:module role      # Only role unit tests (fast)
npm run test:module Controller     # All controller tests
```

## 📚 Documentation

Detailed guides available in the `docs/` folder:

| Guide | Description |
|-------|-------------|
| [TESTING.md](docs/TESTING.md) | Complete testing guide (unit, integration, performance) |
| [TESTING_CHEATSHEET.md](docs/TESTING_CHEATSHEET.md) | Quick reference for all test commands ⚡ |
| [BENCHMARKING.md](docs/BENCHMARKING.md) | Performance tracking and optimization tips |
| [CODE_GENERATION.md](docs/CODE_GENERATION.md) | Code generator usage and customization |


## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t node-starter-kit .

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### Production

```bash
# Build
npm run build

# Set environment
export NODE_ENV=production

# Run migrations
npm run prisma:deploy

# Start server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines:**
- Write tests for new features
- Follow TypeScript/ESLint conventions
- Update documentation as needed
- Maintain >80% code coverage

## 📊 Performance

The starter kit includes built-in performance tracking:

- **Color-coded benchmarks** in test output
- **Automatic logging** to `logs/benchmark/`
- **Performance thresholds**: Fast (<100ms), Acceptable (<500ms), Slow (<1000ms)
- **Summary reports** after test runs
`npm run analyze-benchmark`

Example output:
```
========================================
  Performance Test Summary
========================================

API Call: Get All Users
  ⏱️  Time: 89ms
  Status: 🟢 Fast (Expected: 500ms)

API Call: Create User
  ⏱️  Time: 245ms
  Status: 🟡 Acceptable (Expected: 500ms)
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check Docker containers
docker-compose ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

### Migration Errors
```bash
# Reset database (⚠️ Development only)
npx prisma migrate reset

# Re-run migrations
npm run prisma:migrate

# Regenerate client
npm run prisma:generate

# Run only one seeder
npm run seed -- --name=Permissions
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:5000

# Kill process
lsof -ti:5000 | xargs kill -9
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Jest](https://jestjs.io/) - Testing framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

For questions or issues:
- 📖 Check [Documentation](docs/)
- 🐛 Open an [Issue](../../issues)
- 💬 Start a [Discussion](../../discussions)

---

## Upstream
git remote add upstream git@github.com:Jobinjose01/NodeTS-Starter-Kit.git

**Built with ❤️ using TypeScript, Express, and Prisma**
