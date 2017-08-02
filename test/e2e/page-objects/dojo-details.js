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
  addressGoogleMapsLink: {
    get() {
      return $('.cd-dojo-details__google-maps-link');
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
    get() {
      return $$('.cd-event-list-item__name');
    }
  },
  eventSessions: {
    get() {
      return $$('.cd-event-list-item__sessions');
    }
  },
  eventDate: {
    value(index) {
      return $$('.cd-event-list-item__date-timestamp')[index];
    }
  },
  eventTimes: {
    value(index) {
      return $$('.cd-event-list-item__times-timestamp')[index];
    },
  },
  firstEventViewButton: {
    get() {
      return $('.cd-event-list-item__view');
    },
  },
  eventViewButtons: {
    get() {
      return $$('.cd-event-list-item__view');
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
      let infoColumnSectionContent = InfoColumn.sectionContents[6];
      return infoColumnSectionContent.$('a');
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
  settingsDropdown: {
    get() {
      return $('.cd-dojo-details__settings-dropdown');
    },
  },
  editDojo: {
    get() {
      return $('.cd-dojo-details__settings-dropdown li:nth-child(1) a');
    },
  },
  manageUsers: {
    get() {
      return $('.cd-dojo-details__settings-dropdown li:nth-child(2) a');
    },
  },
  manageEvents: {
    get() {
      return $('.cd-dojo-details__settings-dropdown li:nth-child(3) a');
    },
  },
  privateNotice: {
    get() {
      return $('.cd-dojo-details__private-notice');
    },
  },
  open: {
    value(urlSlug) {
      return BasePage.open.call(this, path.join('/dojos', urlSlug));
    },
  },

});

module.exports = DojoDetailsPage;
