var path = require('path');
const BasePage = require('./base-page');

const DojoDetailsPage = Object.create(BasePage, {
  /**
   * define elements
   */
  name: {
    get() {
      return $('.cd-dojo-details__name');
    },
  },
  time: {
    get() {
      return $('.cd-dojo-details__time');
    },
  },
  address: {
    get() {
      return $('.cd-dojo-details__address');
    },
  },
  details: {
    get() {
      return $('.cd-dojo-details__details');
    },
  },
  email: {
    get() {
      return $('.cd-dojo-details__email');
    },
  },
  website: {
    get() {
      return $('.cd-dojo-details__website');
    },
  },
  facebook: {
    get() {
      return $('.cd-dojo-details__facebook');
    },
  },
  twitter: {
    get() {
      return $('.cd-dojo-details__twitter');
    },
  },
  googleGroup: {
    get() {
      return $('.cd-dojo-details__google-group');
    },
  },
  errorMessage: {
    get() {
      return $('.cd-dojo-details__error-message');
    },
  },
  open: {
    value(urlSlug) {
      return BasePage.open.call(this, path.join('/dojos', urlSlug));
    },
  },

});

module.exports = DojoDetailsPage;
