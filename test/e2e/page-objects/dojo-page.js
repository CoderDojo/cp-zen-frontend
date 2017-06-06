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
  latitudeValue: {
    get() {
      return $('.cd-find-dojo__latitude');
    },
  },
  longitudeValue: {
    get() {
      return $('.cd-find-dojo__longitude');
    },
  },
  addressSearchInput: {
    get() {
      return $('input[name=addressSearch]');
    },
  },
  addressSearchButton: {
    get() {
      return $('input[value="Search Dojos"]');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/');
    },
  },
  openWithLatLong: {
    value(lat, long) {
      return BasePage.open.call(this, `/${lat}/${long}`);
    },
  },
  dojoListItems: {
    get() {
      $('.cd-dojo-list__list-item').waitForVisible();
      return $$('.cd-dojo-list__list-item');
    },
  },
});

module.exports = DojoPage;
