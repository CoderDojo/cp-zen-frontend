const BasePage = require('./base-page');

const BookingConfirmation = Object.create(BasePage, {
  firstName: {
    get() {
      return $('.cd-booking-confirmation__first-name');
    },
  },
  lastName: {
    get() {
      return $('.cd-booking-confirmation__last-name');
    },
  },
  phoneNumber: {
    get() {
      return $('.cd-booking-confirmation__phone-number');
    },
  },
  email: {
    get() {
      return $('.cd-booking-confirmation__email');
    },
  },
  accountCreationConfirmation: {
    get() {
      return $('.cd-booking-confirmation__account-creation-confirmation');
    },
  },
  bookingConfirmationMessage: {
    get() {
      return $('.cd-booking-confirmation__booking-confirmation');
    },
  },
  bookingTicketName: {
    get() {
      return $$('.cd-booking-confirmation__booking-ticket-name');
    },
  },
  bookingFirstName: {
    get() {
      return $$('.cd-booking-confirmation__booking-first-name');
    },
  },
  bookingLastName: {
    get() {
      return $$('.cd-booking-confirmation__booking-last-name');
    },
  },
  bookingDayOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__booking-dob-date');
    },
  },
  bookingMonthOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__booking-dob-month');
    },
  },
  bookingYearOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__booking-dob-year');
    },
  },
  bookingEmailAddress: {
    get() {
      return $$('.cd-booking-confirmation__booking-email');
    },
  },
  bookingGender: {
    get() {
      return $$('.cd-booking-confirmation__booking-gender');
    },
  },
});

module.exports = BookingConfirmation;
