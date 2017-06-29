const EventDetails = require('./event-details');

const BookingParentData = Object.create(EventDetails, {
  open: {
    value(eventId) {
      return this.open.call(this, `/v2/events/${eventId}/book`);
    },
  },
  attendeeTypeHeader: {
    get() {
      $('.cd-booking-parent-form__attendee-type-header').waitForVisible();
      return $$('.cd-booking-parent-form__attendee-type-header');
    },
  },
  nameLabel: {
    get() {
      return $('label[for=name]');
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
  dateOfBirthLabel: {
    get() {
      return $('label.cd-booking-parent-form__parent-dob-label');
    },
  },
  dateOfBirthDayInput: {
    get() {
      return $$('.cd-booking-parent-form__parent-dob select')[0];
    },
  },
  dateOfBirthMonthInput: {
    get() {
      return $$('.cd-booking-parent-form__parent-dob select')[1];
    },
  },
  dateOfBirthYearInput: {
    get() {
      return $$('.cd-booking-parent-form__parent-dob select')[2];
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
  attendeeHeading: {
    get() {
      return $('.cd-booking__attendee-heading')
    },
  },
  selectedTicketsHeading: {
    get() {
      return $('.cd-booking__selected-tickets-heading')
    },
  },
  tickets: {
    value(index) {
      $('.cd-booking__tickets').waitForVisible();
      return $$('.cd-booking__tickets')[index];
    },
  },
  allTickets: {
    value() {
      $('.cd-booking__tickets').waitForVisible();
      return $$('.cd-booking__tickets');
    },
  },
  submitBookingButton: {
    get() {
      return $('input[value="Confirm Booking"]');
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
    value(index) {
      let datePicker = $$('.cd-booking-parent-form__child-dob')[index];
      return datePicker.$$('select')[0];
    },
  },
  sessionTicketMonthOfBirth: {
    value(index) {
      let datePicker = $$('.cd-booking-parent-form__child-dob')[index];
      return datePicker.$$('select')[1];
    },
  },
  sessionTicketYearOfBirth: {
    value(index) {
      let datePicker = $$('.cd-booking-parent-form__child-dob')[index];
      return datePicker.$$('select')[2];
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
  modifyButton: {
    get() {
      return $('.cd-booking__modify');
    },
  },
});

module.exports = BookingParentData;
