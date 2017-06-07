const BasePage = require('./base-page');

const BookingCreateAccount = Object.create(BasePage, {
  password: {
    get() {
      return $('input[name=password]');
    },
  },
  passwordError: {
    get() {
      return $('.cd-booking-create-account__password-error');
    },
  },
  confirmPassword: {
    get() {
      return $('input[name=confirmPassword]');
    },
  },
  confirmPasswordError: {
    get() {
      return $('.cd-booking-create-account__password-confirmation-error');
    },
  },
  createAccount: {
    get() {
      return $('input[type=submit]');
    },
  },
  termsAndConditions: {
    get() {
      return $('input[name=termsConditionsAccepted]');
    },
  },
  termsAndConditionsError: {
    get() {
      return $('.cd-booking-create-account__terms-conditions-error');
    },
  },
  dataConsent: {
    get() {
      return $('input[name=dataConsentAccepted]');
    },
  },
  dataConsentError: {
    get() {
      return $('.cd-booking-create-account__data-consent-error');
    },
  },
  dataUsageLink: {
    get() {
      return $('.cd-booking-create-account__data-usage-link');
    },
  },
  termsAndConditionsLink: {
    get() {
      return $('.cd-booking-create-account__terms-conditions-link');
    },
  },
  checkRecaptcha: {
    value() {
      const selector = '.cd-booking-create-account__recaptcha iframe';
      browser.waitForVisible(selector);
      const iframe = browser.element(selector);
      browser.frame(iframe.value);
      browser.waitForVisible('.recaptcha-checkbox')
      browser.click('.recaptcha-checkbox');
      browser.waitForVisible('.recaptcha-checkbox[aria-checked="true"]');
      browser.frame();
    },
  },
});

module.exports = BookingCreateAccount;
