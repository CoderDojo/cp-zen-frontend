var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_SERVER: '""',
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"'
})
