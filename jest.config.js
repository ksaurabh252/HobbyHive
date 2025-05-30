module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/", "/config/", "/tests/"],
  setupFilesAfterEnv: ["./tests/setup.js"],
};
