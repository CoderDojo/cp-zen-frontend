module.exports = {
  env: {
    mocha: true
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
    sinon: true,
    afterEach: true
  },
  rules: {
    'import/no-webpack-loader-syntax': 0,
    'no-unused-expressions': 0,
    'no-new': 0
  }
};
