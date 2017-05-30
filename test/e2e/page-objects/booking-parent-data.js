const BasePage = require('./base-page');

const BookingParentData = Object.create(BasePage, {

  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}/book`);
    },
  },
  nameLabel: {
    get() {
      return $('label[for=firstName]');
    },
  },
  firstName: {
    get() {
      return $('input[name=firstName]');
    },
  },
  lastName: {
    get() {
      return $('input[name=lastName]');
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
  submitBookingButton: {
    get() {
      return $('input[value="Submit Booking"]');
    },
  },
});

module.exports = BookingParentData;
