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
  childFirstName: {
    get() {
      return $$('.cd-booking-confirmation__child-first-name');
    },
  },
  childLastName: {
    get() {
      return $$('.cd-booking-confirmation__child-last-name');
    },
  },
  childDayOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__child-dob-date');
    },
  },
  childMonthOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__child-dob-month');
    },
  },
  childYearOfBirth: {
    get() {
      return $$('.cd-booking-confirmation__child-dob-year');
    },
  },
  childEmailAddress: {
    get() {
      return $$('.cd-booking-confirmation__child-email');
    },
  },
  childGender: {
    get() {
      return $$('.cd-booking-confirmation__child-gender');
    },
  },
});

module.exports = BookingConfirmation;
