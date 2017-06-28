var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"e2e"',
  API_SERVER: '"http://localhost:3000"'
})
