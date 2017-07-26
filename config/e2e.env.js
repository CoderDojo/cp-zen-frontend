var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"e2e"',
  API_SERVER: '"http://localhost:8080"',
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"'
})
