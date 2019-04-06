module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.spec.tsx'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.tsx',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/*.spec.tsx',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/__*__/*',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  cacheDirectory: '<rootDir>/.cache/',
};
