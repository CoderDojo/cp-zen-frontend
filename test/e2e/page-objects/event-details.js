const BasePage = require('./base-page');

const EventDetails = Object.create(BasePage, {
  bookEventTitle: {
    get() {
      return $('.cd-event-details__book-event-title');
    },
  },
  eventTitle: {
    get() {
      return $('.cd-event-details__event-title');
    },
  },
  sectionIcon: {
    get() {
      return $$('.cd-event-details__left-column-section-icon');
    },
  },
  sectionHeading: {
    get() {
      return $$('.cd-event-details__left-column-section-heading');
    },
  },
  sectionValue: {
    get() {
      return $$('.cd-event-details__left-column-section-value');
    },
  },
});

module.exports = EventDetails;
