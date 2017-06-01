const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-details__name');
    },
  },
  dateOfBirthInput: {
    get() {
      return $('.cd-event-details__dob');
    },
  },
  nextButton: {
    get() {
      return $('.cd-event-details__next');
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}`);
    },
  },

});

module.exports = EventDetailsPage;
