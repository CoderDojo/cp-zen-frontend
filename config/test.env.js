var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_SERVER: '"http://test.coderdojo.com"',
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyD6WWeWYAVLLO1rmVSLiK-gSQUK8-U6w7w"',
  FORUMS_URL_BASE: '"http://localhost:4567"',
})
