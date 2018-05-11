const EventDetails = require('./event-details');

const EventDobVerification = Object.create(EventDetails, {
  name: {
    get() {
      return $('.cd-create-account__dob');
    },
  },
  verifyAgeMessage: {
    get() {
      $('.cd-create-account__dob-error').waitForVisible();
      return $('.cd-create-account__dob-error');
    },
  },
  dobInputLabel: {
    get() {
      return $('.cd-create-account__dob .cd-create-account__label');
    },
  },
  dateOfBirthDayInput: {
    get() {
      const selector = '.cd-create-account__dob-picker select';
      $(selector).waitForVisible();
      return $$(selector)[0];
    },
  },
  dateOfBirthMonthInput: {
    get() {
      const selector = '.cd-create-account__dob-picker select';
      $(selector).waitForVisible();
      return $$(selector)[1];
    },
  },
  dateOfBirthYearInput: {
    get() {
      const selector = '.cd-create-account__dob-picker select';
      $(selector).waitForVisible();
      return $$(selector)[2];
    },
  },
  verify: {
    get() {
      return $('.cd-create-account__submit');
    },
  },
  dateOfBirthError: {
    get() {
      return $('.cd-create-account__dob-error');
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/v2/events/${eventId}`);
    },
  },

});

module.exports = EventDobVerification;
