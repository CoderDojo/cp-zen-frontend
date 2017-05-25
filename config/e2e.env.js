var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"e2e"',
  API_BASE: '"http://localhost:3000/api/2.0"'
})
