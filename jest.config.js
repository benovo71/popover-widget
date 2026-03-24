module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/tests/**/*.js", "**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js", // Исключаем точку входа из покрытия
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
    "\\.(scss|css)$": "identity-obj-proxy", // Если тестируете компоненты со стилями
    "\\.(png|jpg|gif|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
};
