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
      return $('input[value="Search for Dojos"]');
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
  noResultsMessage: {
    get() {
      return $('.cd-find-dojo__no-results-message');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/');
    },
  },
  openWithLatLong: {
    value(lat, long) {
      return BasePage.open.call(this, `/v2/${lat}/${long}`);
    },
  },
  openDojoWithLatLong: {
    value(lat, long, index = 2) {
      this.openWithLatLong(lat, long);
      this.dojoListItems[index].click();
    },
  },
});

module.exports = DojoPage;
