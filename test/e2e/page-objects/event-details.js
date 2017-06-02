const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-details__name');
    },
  },
  dateOfBirthDayInput: {
    get() {
      return $('.cd-event-details__dob-day');
    },
  },
  dateOfBirthMonthInput: {
    get() {
      return $('.cd-event-details__dob-month');
    },
  },
  dateOfBirthYearInput: {
    get() {
      return $('.cd-event-details__dob-year');
    },
  },
  nextButton: {
    get() {
      return $('.cd-event-details__next');
    },
  },
  dateOfBirthError: {
    get() {
      return $('.cd-event-details__dob-error');
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}`);
    },
  },

});

module.exports = EventDetailsPage;
