const EventDetails = require('./event-details');

const EventDobVerification = Object.create(EventDetails, {
  name: {
    get() {
      return $('.cd-event-dob-verification__name');
    },
  },
  verifyAgeMessage: {
    get() {
      $('.cd-event-dob-verification__verify-age-message').waitForVisible();
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
      const selector = '.cd-event-dob-verification__dob select';
      $(selector).waitForVisible();
      return $$(selector)[0];
    },
  },
  dateOfBirthMonthInput: {
    get() {
      const selector = '.cd-event-dob-verification__dob select';
      $(selector).waitForVisible();
      return $$(selector)[1];
    },
  },
  dateOfBirthYearInput: {
    get() {
      const selector = '.cd-event-dob-verification__dob select';
      $(selector).waitForVisible();
      return $$(selector)[2];
    },
  },
  verify: {
    get() {
      return $('.cd-event-dob-verification__actions-verify');
    },
  },
  dateOfBirthError: {
    get() {
      return $('.cd-event-dob-verification__dob-error');
    },
  },
  dateOfBirthInvalidError: {
    get() {
      return $('.cd-event-dob-verification__invalid-dob-error');
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/v2/events/${eventId}`);
    },
  },

});

module.exports = EventDobVerification;
