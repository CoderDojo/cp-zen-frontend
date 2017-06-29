const BasePage = require('./base-page');

const DojoPage = Object.create(BasePage, {
  header: {
    get() {
      return $('.cd-find-dojo__panel-form-header');
    },
  },
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
  dojoListItemImages: {
    get() {
      return $$('.cd-dojo-list-item__dojo-image');
    },
  },
  showDojoListCount: {
    get() {
      return $('.cd-dojo-list__show-dojo-list-count');
    },
  },
  map: {
    get() {
      return $('.cd-find-dojo__results-map');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/v2/');
    },
  },
  openWithLatLong: {
    value(lat, long) {
      return BasePage.open.call(this, `/v2/${lat}/${long}`);
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
