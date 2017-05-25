const BasePage = require('./base-page');

const FindDojoPage = Object.create(BasePage, {
  detectLocationButton: {
    get() {
      return $('.cd-find-dojo__detect-location');
    },
  },
  coordinates: {
    get() {
      return $('.cd-find-dojo__coordinates');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/');
    },
  },
});

module.exports = FindDojoPage;
