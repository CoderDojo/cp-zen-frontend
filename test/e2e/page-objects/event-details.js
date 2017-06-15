const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-details__name');
    },
  },
  verifyAgeMessage: {
    get() {
      return $('.cd-event-details__verify-age-message');
    },
  },
  dobInputLabel: {
    get() {
      return $('.cd-event-details__dob-input-label');
    },
  },
  dateOfBirthDayInput: {
    get() {
      return $$('.cd-event-details__dob select')[0];
    },
  },
  dateOfBirthMonthInput: {
    get() {
      return $$('.cd-event-details__dob select')[1];
    },
  },
  dateOfBirthYearInput: {
    get() {
      return $$('.cd-event-details__dob select')[2];
    },
  },
  verify: {
    get() {
      return $('.cd-event-details__verify');
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
