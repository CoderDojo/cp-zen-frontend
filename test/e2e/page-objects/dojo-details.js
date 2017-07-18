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
      let infoColumnSectionContent = InfoColumn.sectionContents[3];
      return infoColumnSectionContent.$('a');
    },
  },
  detailsLabel: {
    get() {
      return $$('.cd-dojo-details__heading')[1];
    },
  },
  details: {
    get() {
      return $('.cd-dojo-details__details');
    },
  },
  sponsorHeading: {
    get() {
      return $$('.cd-dojo-details__heading')[3];
    },
  },
  sponsorImage: {
    get() {
      return $('.cd-dojo-details__sponsor-image');
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
    },
  },
  eventViewButtons: {
    get() {
      return $$('.cd-event-list__event-view');
    },
  },
  emailLabelMobile: {
    get() {
      return InfoColumn.sectionHeaders[4];
    },
  },
  emailMobile: {
    get() {
      return InfoColumn.sectionContents[5];
    },
  },
  websiteLabelMobile: {
    get() {
      return InfoColumn.sectionHeaders[5];
    },
  },
  websiteMobile: {
    get() {
      return InfoColumn.sectionContents[6];
    },
  },
  facebookMobile: {
    get() {
      return $$('.cd-dojo-details__facebook')[1].getAttribute('href');
    },
  },
  twitterMobile: {
    get() {
      return $$('.cd-dojo-details__twitter')[1].getAttribute('href');
    },
  },
  googleGroupMobile: {
    get() {
      return $$('.cd-dojo-details__google-group')[1].getAttribute('href');
    },
  },
  open: {
    value(urlSlug) {
      return BasePage.open.call(this, path.join('/dojos', urlSlug));
    },
  },

});

module.exports = DojoDetailsPage;
