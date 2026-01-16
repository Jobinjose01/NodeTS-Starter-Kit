module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/src/config/jest.setup.ts'],
    roots: ['<rootDir>/src'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'text-summary', 'clover'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/templates/'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/templates/'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };
  