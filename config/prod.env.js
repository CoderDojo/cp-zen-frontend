module.exports = {
  NODE_ENV: '"production"',
  API_SERVER: '""',
  RECAPTCHA_SITE_KEY: '"6LfVKQgTAAAAAF3wUs0q-vfrtsKdHO1HCAkp6pnY"',
  GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GIT_BRANCH === 'master' ? '"UA-25136319-2"': '"UA-25136319-8"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyC3xF9XV91bS2R14Gjmx3UQaKbGgAfHbE4"',
  GIT_BRANCH: `"${process.env.GIT_BRANCH}"`,
  NEWS_URL_BASE: 'https://coderdojo.com',
  FORUMS_URL_BASE: 'https://forums.coderdojo.com',
}
