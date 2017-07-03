var path = require('path');
const InfoColumn = require('./info-column');

const DojoDetailsPage = Object.create(InfoColumn, {
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
      return InfoColumn.sectionHeaders[0];
    },
  },
  time: {
    get() {
      return InfoColumn.sectionContents[0];
    },
  },
  addressLabel: {
    get() {
      return InfoColumn.sectionHeaders[1];
    },
  },
  address: {
    get() {
      return InfoColumn.sectionContents[1];
    },
  },
  emailLabel: {
    get() {
      return InfoColumn.sectionHeaders[2];
    },
  },
  email: {
    get() {
      return InfoColumn.sectionContents[2];
    },
  },
  websiteLabel: {
    get() {
      return InfoColumn.sectionHeaders[3];
    },
  },
  website: {
    get() {
      return InfoColumn.sectionContents[3];
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
  sponsorHeading: {
    get() {
      return $('.cd-dojo-details__sponsor_heading');
    },
  },
  sponsorImage: {
    get() {
      return $('.cd-dojo-details__sponsor_image');
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
  noEventsHeader: {
    get() {
      return $('.cd-event-list__no-events-header');
    },
  },
  noEventsContent: {
    get() {
      return $('.cd-event-list__no-events-content');
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
