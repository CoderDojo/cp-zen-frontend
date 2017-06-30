var path = require('path');
const BasePage = require('./base-page');

const DojoDetailsPage = Object.create(BasePage, {
  /**
   * define elements
   */
  dojoImage: {
    get() {
      return $('.cd-dojo-details__dojo-image');
    },
  },
  name: {
    get() {
      return $('.cd-dojo-details__name');
    },
  },
  timeLabel: {
    get() {
      return $('.cd-dojo-details__time-label');
    },
  },
  time: {
    get() {
      return $('.cd-dojo-details__time');
    },
  },
  addressLabel: {
    get() {
      return $('.cd-dojo-details__address-label');
    },
  },
  address: {
    get() {
      return $('.cd-dojo-details__address');
    },
  },
  detailsLabel: {
    get() {
      return $('.cd-dojo-details__details-label');
    },
  },
  details: {
    get() {
      return $('.cd-dojo-details__details');
    },
  },
  emailLabel: {
    get() {
      return $('.cd-dojo-details__email-label');
    },
  },
  email: {
    get() {
      return $('.cd-dojo-details__email');
    },
  },
  websiteLabel: {
    get() {
      return $('.cd-dojo-details__website-label');
    },
  },
  website: {
    get() {
      return $('.cd-dojo-details__website');
    },
  },
  facebook: {
    get() {
      return $('.cd-dojo-details__facebook').getAttribute('href');
    },
  },
  twitter: {
    get() {
      return $('.cd-dojo-details__twitter').getAttribute('href');
    },
  },
  googleGroup: {
    get() {
      return $('.cd-dojo-details__google-group').getAttribute('href');
    },
  },
  errorMessage: {
    get() {
      return $('.cd-dojo-details__error-message');
    },
  },
  eventNames: {
    value(index) {
      return $$('.cd-event-list__event-name')[index];
    }
  },
  eventSessions: {
    value(index) {
      return $$('.cd-event-list__event-sessions')[index];
    }
  },
  eventDate: {
    value(index) {
      return $$('.cd-event-list__event-date-timestamp')[index];
    }
  },
  eventTimes: {
    value(index) {
      return $$('.cd-event-list__event-times-timestamp')[index];
    }
  },
  eventViewButtons: {
    value(index) {
      return $$('.cd-event-list__event-view')[index];
    }
  },
  open: {
    value(urlSlug) {
      return BasePage.open.call(this, path.join('/dojos', urlSlug));
    },
  },

});

module.exports = DojoDetailsPage;
