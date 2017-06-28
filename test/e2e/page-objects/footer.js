const BasePage = require('./base-page');

const Footer = Object.create(BasePage, {
  languagePicker: {
    get() {
      return $('.cd-lang-picker__select');
    },
  },
});

module.exports = Footer;
