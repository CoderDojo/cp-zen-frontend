const EventDetails = require('./event-details');

const RegisterOrLogin = Object.create(EventDetails, {
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
  email: {
    get() {
      return $('input[name="email"]');
    },
  },
  emailValidationError: {
    get() {
      return $$('.cd-create-account-form__email-error');
    },
  },
  firstName: {
    get() {
      return $('input[name="firstName"]');
    },
  },
  lastName: {
    get() {
      return $('input[name="lastName"]');
    },
  },
  password: {
    get() {
      return $('input[name="password"]');
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
  termsAndCond: {
    get() {
      return $('input[name="termsConditionsAccepted"]');
    },
  },
  redirectToLogin: {
    get() {
      return $('.cd-redirect-to-login a');
    },
  },
  checkRecaptcha: {
    value() {
      const selector = '.cd-create-account__recaptcha iframe';
      browser.waitForVisible(selector);
      const iframe = browser.element(selector);
      browser.frame(iframe.value);
      browser.waitForVisible('.recaptcha-checkbox')
      browser.click('.recaptcha-checkbox');
      browser.waitForVisible('.recaptcha-checkbox[aria-checked="true"]');
      browser.frame();
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/v2/events/${eventId}`);
    },
  },

});

module.exports = RegisterOrLogin;
