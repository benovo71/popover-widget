module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '\\.(png|jpg|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
};