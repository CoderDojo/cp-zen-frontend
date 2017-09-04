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
  dojoListItemNames: {
    get() {
      $('.cd-dojo-list-item__name').waitForVisible();
      return $$('.cd-dojo-list-item__name');
    },
  },
  dojoListItemMetas: {
    get() {
      $('.cd-dojo-list-item__meta').waitForVisible();
      return $$('.cd-dojo-list-item__meta');
    },
  },
  dojoListItemImages: {
    get() {
      return $$('.cd-dojo-list-item__dojo-image');
    },
  },
  showDojoListCount: {
    get() {
      return $('.cd-find-dojo__results-header:not(.cd-find-dojo__results-header--mobile)');
    },
  },
  showDojoListCountMobile: {
    get() {
      return $('.cd-find-dojo__results-header--mobile');
    },
  },
  toggleMap: {
    get() {
      return $('.cd-find-dojo__results-header-map-toggle');
    },
  },
  map: {
    get() {
      return $('.cd-find-dojo__results-map');
    },
  },
  startADojoMessage: {
    get() {
      return $('.cd-find-dojo__start-a-dojo-message');
    },
  },
  startADojoMessageMobile: {
    get() {
      return $$('.cd-find-dojo__start-a-dojo-message')[1];
    },
  },
  startADojoButton: {
    get() {
      return $('.cd-find-dojo__start-a-dojo-button');
    },
  },
  startADojoButtonMobile: {
    get() {
      return $$('.cd-find-dojo__start-a-dojo-button')[1];
    },
  },
  noResultsMessage: {
    get() {
      return $('.cd-find-dojo__no-results-message');
    },
  },
  noResultsMessageMapLink: {
    get() {
      return $('.cd-find-dojo__no-results-message--mobile a');
    },
  },
  paginationButtonPageTwo: {
    get() {
      const vuePagination = $('.VuePagination');
      return vuePagination.$$('.page-link')[3];
    },
  },
  open: {
    value(clearCookie) {
      return BasePage.open.call(this, '/', clearCookie);
    },
  },
  openWithQuery: {
    value(query, clearCookie) {
      return BasePage.open.call(this, `?q=${query}`, clearCookie);
    },
  },
  openDojoWithQuery: {
    value(query, index = 2, clearCookie = true) {
      this.openWithQuery(query, clearCookie);
      this.dojoListItemNames[index].click();
    },
  },
});

module.exports = DojoPage;
