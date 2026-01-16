# Documentation Index

Complete documentation for the Node.js Starter Kit project.

## 📚 Documentation Structure

### Getting Started
- **[Main README](../Readme.md)** - Project overview, quick start, and setup
- **[API Documentation](http://localhost:3000/api-docs)** - Interactive Swagger/OpenAPI docs (when server is running)

### Testing
- **[TESTING.md](./TESTING.md)** - Complete testing guide
  - Test types (unit, integration)
  - Running tests
  - Writing new tests
  - Test data management
  - Coverage reports
  
- **[TEST_DATA_CLEANUP.md](./TEST_DATA_CLEANUP.md)** - Test data management ✨ NEW
  - `CLEAN_TEST_DATA` environment variable
  - Smart cleanup logic
  - Debugging with preserved data
  - Best practices and troubleshooting

- **[INTEGRATION_TEST_AUTH.md](./INTEGRATION_TEST_AUTH.md)** - Authentication setup
  - Shared authentication token
  - Token management
  - Setup configuration

- **[TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md)** - Quick reference
  - Common test commands
  - Test structure patterns
  - Quick troubleshooting

### Performance & Monitoring
- **[BENCHMARKING.md](./BENCHMARKING.md)** - Performance monitoring
  - Performance middleware
  - Benchmark logging
  - Log file locations
  - Analyzing performance data

### Code Generation
- **[CODE_GENERATION.md](./CODE_GENERATION.md)** - Automated code generation
  - Module generator usage
  - Template structure
  - Generated file overview
  - Customization guide

### API Reference
- **[API_STANDARDS.md](./API_STANDARDS.md)** - RESTful API standards
  - HTTP methods and status codes
  - Request/response formats
  - Error handling
  - Pagination

### Development
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
  - Project structure
  - Design patterns
  - Dependencies
  - Technology stack

## 🎯 Quick Navigation

### I want to...

#### Run Tests
```bash
# All tests with coverage
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Keep test data for debugging
CLEAN_TEST_DATA=false npm test
```
📖 See: [TESTING.md](./TESTING.md) | [TEST_DATA_CLEANUP.md](./TEST_DATA_CLEANUP.md)

#### Generate a New Module
```bash
# Generate complete module (model, controller, service, routes, tests)
npm run generate

# Follow the interactive prompts
```
📖 See: [CODE_GENERATION.md](./CODE_GENERATION.md)

#### Monitor Performance
```bash
# Start server (performance logging automatic)
npm run dev

# Check benchmark logs
cat logs/benchmark/benchmark-YYYY-MM-DD.log
```
📖 See: [BENCHMARKING.md](./BENCHMARKING.md)

#### Understand API Standards
```bash
# View Swagger docs
npm run dev
# Open http://localhost:3000/api-docs
```
📖 See: [API_STANDARDS.md](./API_STANDARDS.md)

#### Debug Test Failures
```bash
# Keep test data in database
CLEAN_TEST_DATA=false npm test

# Inspect database
npx prisma studio

# Re-enable cleanup when done
CLEAN_TEST_DATA=true npm test
```
📖 See: [TEST_DATA_CLEANUP.md](./TEST_DATA_CLEANUP.md) | [TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md)

## 📋 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| [Main README](../Readme.md) | ✅ Complete | Latest |
| [TESTING.md](./TESTING.md) | ✅ Complete | Latest |
| [TEST_DATA_CLEANUP.md](./TEST_DATA_CLEANUP.md) | ✅ Complete | Latest |
| [INTEGRATION_TEST_AUTH.md](./INTEGRATION_TEST_AUTH.md) | ✅ Complete | Latest |
| [TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md) | ✅ Complete | Latest |
| [BENCHMARKING.md](./BENCHMARKING.md) | ✅ Complete | Latest |
| [CODE_GENERATION.md](./CODE_GENERATION.md) | ✅ Complete | Latest |
| [API_STANDARDS.md](./API_STANDARDS.md) | ✅ Complete | Latest |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | ⚠️ Planned | - |

## 🔗 External Resources

### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express 5.x](https://expressjs.com/en/5x/api.html)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Related Tools
- [Swagger/OpenAPI](https://swagger.io/specification/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [Joi Validation](https://joi.dev/api/)
- [Inversify IoC](https://inversify.io/)

## 📝 Contributing to Documentation

When adding new features or making changes:

1. **Update relevant docs** - Keep documentation in sync with code
2. **Add examples** - Show real-world usage
3. **Update this index** - Add new documents to the table
4. **Test instructions** - Verify all commands work as documented
5. **Cross-reference** - Link related documents

## 🎓 Learning Path

### For New Developers
1. Start with [Main README](../Readme.md) for project overview
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand structure
3. Follow [API_STANDARDS.md](./API_STANDARDS.md) for API conventions
4. Review [TESTING.md](./TESTING.md) for testing practices

### For Contributors
1. Read [CODE_GENERATION.md](./CODE_GENERATION.md) to create new modules
2. Understand [TEST_DATA_CLEANUP.md](./TEST_DATA_CLEANUP.md) for testing
3. Follow [TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md) for quick reference
4. Check [BENCHMARKING.md](./BENCHMARKING.md) for performance monitoring

### For Operations
1. Review [Main README](../Readme.md) for deployment
2. Check [BENCHMARKING.md](./BENCHMARKING.md) for monitoring
3. Understand log locations and formats

## 💡 Tips

- 🔍 Use Ctrl+F to search within documents
- 📌 Bookmark frequently used pages
- 🔄 Docs are versioned with code - always check latest
- 💬 Ask questions if anything is unclear
- ✨ Contribute improvements via pull requests

## 📊 Coverage Summary

Current test coverage:
- **Statements**: ~80%
- **Branches**: ~56%
- **Functions**: ~75%
- **Lines**: ~80%

Run `npm test` to see detailed coverage report.

---

**Last Updated**: 2026
**Project Version**: 1.0.0
**Node Version**: 20.x
**Package Manager**: npm

For issues or questions, check existing documentation first, then create an issue in the project repository.
