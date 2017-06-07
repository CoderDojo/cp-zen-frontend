const BasePage = require('./base-page');

const BookingCreateAccount = Object.create(BasePage, {
  password: {
    get() {
      return $('input[name=password]');
    },
  },
  passwordError: {
    get() {
      return $('.password-error');
    },
  },
  confirmPassword: {
    get() {
      return $('input[name=confirmPassword]');
    },
  },
  confirmPasswordError: {
    get() {
      return $('.password-confirmation-error');
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
      return $('.terms-conditions-error');
    },
  },
  dataConsent: {
    get() {
      return $('input[name=dataConsentAccepted]');
    },
  },
  dataConsentError: {
    get() {
      return $('.data-consent-error');
    },
  },
  dataUsageLink: {
    get() {
      return $('.data-usage-link');
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
