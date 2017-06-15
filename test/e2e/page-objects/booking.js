const BasePage = require('./base-page');

const BookingParentData = Object.create(BasePage, {

  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}/book`);
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
});

module.exports = BookingParentData;
