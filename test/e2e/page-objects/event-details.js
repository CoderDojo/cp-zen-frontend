const BasePage = require('./base-page');

const EventDetails = Object.create(BasePage, {
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
