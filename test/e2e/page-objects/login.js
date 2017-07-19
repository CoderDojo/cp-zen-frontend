var path = require('path');
const BasePage = require('./base-page');

const LoginPage = Object.create(BasePage, {
  /**
   * define elements
   */
  email: {
    get() {
      return $('input[type=email]');
    },
  },
  password: {
    get() {
      return $('input[type=password]');
    },
  },
  login: {
    get() {
      return $('input[type=submit]');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/v2/login');
    },
  },
});

module.exports = LoginPage;
