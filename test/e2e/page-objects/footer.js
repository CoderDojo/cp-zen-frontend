const BasePage = require('./base-page');

const Footer = Object.create(BasePage, {
  cookieNotice: {
    get() {
      return $('.cd-cookie-notice');
    },
  },
  cookieNoticeDismissButton: {
    get() {
      return $('.cd-cookie-notice__dismiss');
    },
  },
  languagePicker: {
    get() {
      return $('.cd-lang-picker__select');
    },
  },
});

module.exports = Footer;
