const BasePage = require('./base-page');

const BookingConfirmation = Object.create(BasePage, {
  emailMessage: {
    get() {
      return $('.cd-booking-confirmation__banner-subtitle');
    },
  },
  accountCreationConfirmation: {
    get() {
      return $$('.cd-booking-confirmation__account-confirmation')[0];
    },
  },
  bookingConfirmationMessage: {
    get() {
      return $('.cd-booking-confirmation__banner-title');
    },
  },
  joinedDojoConfirmation: {
    get() {
      return $$('.cd-booking-confirmation__account-confirmation')[1];
    },
  },
  hostedByMessage: {
    get() {
      return $('.cd-booking-confirmation__hosted-by-message');
    },
  },
  eventName: {
    get() {
      return $('.cd-booking-confirmation__event-name');
    },
  },
  detailsBoxTitle: {
    value(index) {
      return $$('.cd-booking-confirmation__booking-details-box-title')[index];
    },
  },
  eventDate: {
    get() {
      return $('.cd-booking-confirmation__event-date');
    },
  },
  eventTimes: {
    get() {
      return $('.cd-booking-confirmation__event-times');
    },
  },
  recurringFrequencyInfo: {
    get() {
      return $('.cd-booking-confirmation__recurring-frequency-info');
    },
  },
  eventLocation: {
    get() {
      return $('.cd-booking-confirmation__event-location');
    },
  },
  bookingName: {
    value(index) {
      return $$('.cd-booking-confirmation__booking-name')[index];
    },
  },
  bookingSessionTicket: {
    value(index) {
      return $$('.cd-booking-confirmation__booking-session-ticket')[index];
    },
  },
  eventDetailsHeader: {
    get() {
      return $('.cd-booking-confirmation__event-details-header');
    },
  },
  eventDescription: {
    get() {
      return $('.cd-booking-confirmation__event-description');
    },
  },
});

module.exports = BookingConfirmation;
