const BasePage = require('./base-page');

const Footer = Object.create(BasePage, {
  picker: {
    get() {
      return $('.cd-lang-picker__select');
    },
  },
});

module.exports = Footer;