const BasePage = require('./base-page');

const DojoPage = Object.create(BasePage, {
  detectLocationButton: {
    get() {
      return $('.cd-find-dojo__panel-form-detect-location');
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
  dojoListItems: {
    get() {
      $('.cd-dojo-list-item__name').waitForVisible();
      return $$('.cd-dojo-list-item__name');
    },
  },
  showDojoListCount: {
    get() {
      return $('.cd-dojo-list__show-dojo-list-count');
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
  openDojoWithLatLong: {
    value(lat, long) {
      this.openWithLatLong(lat, long);
      this.dojoListItems[2].click();
    },
  },
});

module.exports = DojoPage;
