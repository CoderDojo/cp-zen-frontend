module.exports = {
  NODE_ENV: '"production"',
  API_SERVER: '""', // False good idea, remove me
  RECAPTCHA_SITE_KEY: '"6LfVKQgTAAAAAF3wUs0q-vfrtsKdHO1HCAkp6pnY"',
  GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GIT_BRANCH === 'master' ? '"UA-25136319-2"' : '"UA-25136319-8"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyCLtwLgQX5wXFJ9bK3hYid5YaW6Qo4bGpc"',
  GIT_BRANCH: `"${process.env.GIT_BRANCH}"`,
  NEWS_URL_BASE: '"https://coderdojo.com"',
  CODERDOJO_WP_GRAPHQL_URL: '"https://rpfcoderdojo.wpengine.com/graphql"',
  FORUMS_URL_BASE: '"https://forums.coderdojo.com"',
  PROJECTS_URL_BASE: '"https://learning-admin.raspberrypi.org"',
}
