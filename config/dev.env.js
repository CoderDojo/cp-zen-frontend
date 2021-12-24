var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: '""', // False good idea, remove me
  RECAPTCHA_SITE_KEY: '"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"',
  GOOGLE_ANALYTICS_PROPERTY_ID: '"UA-25136319-8"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyA4lRJMDmdT_60aUSsih78adO2A9Gzv5UM"',
  NEWS_URL_BASE: '""',
  FORUMS_URL_BASE: '"http://localhost:4567"',
  PROJECTS_URL_BASE: '""',
})
