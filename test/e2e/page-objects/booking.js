const EventDetails = require('./event-details');

const BookingParentData = Object.create(EventDetails, {
  open: {
    value(eventId) {
      return this.open.call(this, `/events/${eventId}/book`);
    },
  },
  firstNameLabel: {
    get() {
      return $('label[for=firstName]');
    },
  },
  firstName: {
    get() {
      return $('input[name=firstName]');
    },
  },
  firstNameValidationError: {
    get() {
      return $('p[id=firstNameValidationError]');
    },
  },
  lastName: {
    get() {
      return $('input[name=lastName]');
    },
  },
  lastNameValidationError: {
    get() {
      return $('p[id=lastNameValidationError]');
    },
  },
  phoneNumberLabel: {
    get() {
      return $('label[for=phoneNumber]');
    },
  },
  phoneNumber: {
    get() {
      return $('input[name=phoneNumber]');
    },
  },
  phoneNumberValidationError: {
    get() {
      return $('p[id=phoneNumberValidationError]');
    },
  },
  emailLabel: {
    get() {
      return $('label[for=email]');
    },
  },
  email: {
    get() {
      return $('input[name=email]');
    },
  },
  emailValidationError: {
    get() {
      return $('p[id=emailValidationError]');
    },
  },
  tickets: {
    value(index) {
      $('.cd-booking-tickets').waitForVisible();
      return $$('.cd-booking-tickets')[index];
    },
  },
  allTickets: {
    value() {
      $('.cd-booking-tickets').waitForVisible();
      return $$('.cd-booking-tickets');
    },
  },
  lastNameLabel: {
    get() {
      return $('label[for=lastName]');
    },
  },
  submitBookingButton: {
    get() {
      return $('input[value="Submit Booking"]');
    },
  },
  sessionTicketTitle: {
    get() {
      $('.cd-booking-parent-form__child-section').waitForVisible();
      return $$('.cd-booking-parent-form__child-section');
    },
  },
  sessionTicketFirstName: {
    get() {
      return $$('.cd-booking-parent-form__child-first-name');
    },
  },
  sessionTicketLastName: {
    get() {
      return $$('.cd-booking-parent-form__child-last-name');
    },
  },
  sessionTicketDayOfBirth: {
    get() {
      return $$('.cd-booking-parent-form__child-dob-date');
    },
  },
  sessionTicketMonthOfBirth: {
    get() {
      return $$('.cd-booking-parent-form__child-dob-month');
    },
  },
  sessionTicketYearOfBirth: {
    get() {
      return $$('.cd-booking-parent-form__child-dob-year');
    },
  },
  sessionTicketEmailAddress: {
    get() {
      return $$('.cd-booking-parent-form__child-email');
    },
  },
  sessionTicketGender: {
    value(gender) {
      return $$(`.cd-booking-parent-form__child-gender input[value=${gender}]`);
    },
  },
  sessionOtherGender: {
    get() {
      return $$('.cd-booking-parent-form__child-gender input[name^=otherGender]');
    },
  },
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

module.exports = BookingParentData;
