module.exports = {
  testEnvironment: "node",
  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node", "model.js"],
  watchPathIgnorePatterns: ["<rootDir>/.git/", "<rootDir>/node_modules/"],
  testTimeout: 30000,
};
