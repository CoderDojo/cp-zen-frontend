const BasePage = require('./base-page');

const DojoPage = Object.create(BasePage, {
  header: {
    get() {
      return $('.cd-find-dojo__panel-form-header');
    },
  },
  headerReduced: {
    get() {
      return $('.cd-find-dojo__panel-form-header--reduced');
    },
  },
  headerReducedMobile: {
    get() {
      return $$('.cd-find-dojo__panel-form-header--reduced')[1];
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
  addressSearchButtonMobile: {
    get() {
      return $$('input[value="Search for Dojos"]')[1];
    },
  },
  dojoListItemNames: {
    get() {
      $('.cd-dojo-list-item__name').waitForVisible();
      return $$('.cd-dojo-list-item__name');
    },
  },
  dojoListHasEvent: {
    get() {
      $('.cd-dojo-list-item .cd-event-stamp').waitForVisible();
      return $$('.cd-dojo-list-item .cd-event-stamp');
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
      return $('.cd-find-dojo__start-a-dojo-box.visible-xs .cd-find-dojo__start-a-dojo-message');
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
      return BasePage.open.call(this, '/find', clearCookie);
    },
  },
  openWithQuery: {
    value(query, clearCookie) {
      return BasePage.open.call(this, `/find?q=${query}`, clearCookie);
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
