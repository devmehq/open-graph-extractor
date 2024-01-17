module.exports = {
  preset: 'ts-jest',
  testTimeout: 5000,
  testRegex: '__tests__/.*.test.ts$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  testEnvironment: 'node',
  collectCoverage: false,
  coverageReporters: ['json', 'html'],
};
