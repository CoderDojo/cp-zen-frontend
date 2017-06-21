const EventDetails = require('./event-details');

const EventDobVerification = Object.create(EventDetails, {
  name: {
    get() {
      return $('.cd-event-dob-verification__name');
    },
  },
  verifyAgeMessage: {
    get() {
      return $('.cd-event-dob-verification__verify-age-message');
    },
  },
  dobInputLabel: {
    get() {
      return $('.cd-event-dob-verification__dob-input-label');
    },
  },
  dateOfBirthDayInput: {
    get() {
      return $$('.cd-event-dob-verification__dob select')[0];
    },
  },
  dateOfBirthMonthInput: {
    get() {
      return $$('.cd-event-dob-verification__dob select')[1];
    },
  },
  dateOfBirthYearInput: {
    get() {
      return $$('.cd-event-dob-verification__dob select')[2];
    },
  },
  verify: {
    get() {
      return $('.cd-event-dob-verification__verify');
    },
  },
  dateOfBirthError: {
    get() {
      return $('.cd-event-dob-verification__dob-error');
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}`);
    },
  },

});

module.exports = EventDobVerification;
