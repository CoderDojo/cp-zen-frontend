module.exports = {
  NODE_ENV: '"production"',
  API_SERVER: '""',
  RECAPTCHA_SITE_KEY: '"6LfVKQgTAAAAAF3wUs0q-vfrtsKdHO1HCAkp6pnY"',
  GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GIT_BRANCH === 'master' ? '"UA-25136319-2"': '"UA-25136319-8"'
}
