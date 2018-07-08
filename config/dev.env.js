var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: '""',
  S3_SERVER: '"http://localhost:8099"',
  RECAPTCHA_SITE_KEY: '"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"',
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyC3xF9XV91bS2R14Gjmx3UQaKbGgAfHbE4"'
})
