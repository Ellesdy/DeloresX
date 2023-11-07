module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  transform: {
  // TODO: Add any additional Jest configurations here
    '^.+\\.js$': 'babel-jest'
  }
};
