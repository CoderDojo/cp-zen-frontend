var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_SERVER: '""', // False good idea, remove me
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"',
  FORUMS_URL_BASE: '"http://localhost:4567"',
  NEWS_URL_BASE: '""',
  CODERDOJO_WP_GRAPHQL_URL: '"http://fakeurl/graphql"',
});
