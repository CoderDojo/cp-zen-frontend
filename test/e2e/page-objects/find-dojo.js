const BasePage = require('./base-page');

const DojoPage = Object.create(BasePage, {
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
  dojoListItems: {
    get() {
      return $$('.cd-dojo-list__list-item');
    },
  },
});

module.exports = DojoPage;
