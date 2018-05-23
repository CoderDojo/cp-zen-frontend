const EventDetails = require('./event-details');

const BookingParentData = Object.create(EventDetails, {
  open: {
    value(eventId) {
      return this.open.call(this, `/v2/events/${eventId}/book`);
    },
  },
  eventIsFullEmoji: {
    get() {
      return $('.cd-event-sessions__no-tickets-emoji');
    },
  },
  eventIsFullHeader: {
    get() {
      return $('.cd-event-sessions__no-tickets h3');
    },
  },
  eventIsFullSubheader: {
    get() {
      return $('.cd-event-sessions__no-tickets h4');
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
  phoneNumberLabel: {
    get() {
      return $('label[for=phoneNumber]');
    },
  },
  phoneNumber: {
    get() {
      return $('.cd-event-sessions__phone-number-input input');
    },
  },
  phoneNumberValidationError: {
    get() {
      return $('.cd-event-session__phone-number-err-required');
    },
  },
  tickets: {
    get() {
      return $$('.cd-event-tickets');
    },
  },
  ticketName: {
    value(index) {
      return $$('.cd-event-tickets__name')[index];
    }
  },
  ticketSelector: {
    value(index) {
      return $$('.cd-event-tickets__ticket-selector')[index];
    }
  },
  submitBookingButton: {
    get() {
      return $('button[name="submitApplications"]');
    },
  },
  addYouthButton: {
    get() {
      return $('button.cd-event-sessions__add-youth');
    },
  },
  childrenTickets: {
    get() {
      return $$('.cd-child-ticket__ticket-box');
    },
  },
  removeChildTicket: {
    get() {
      return $$('.cd-child-ticket__delete-ticket i');
    },
  },
  childTicketTitle: {
    get() {
      $('.cd-child-ticket__header').waitForVisible();
      return $$('.cd-child-ticket__header');
    },
  },
  childTicketFirstName: {
    get() {
      return $$('.cd-child-ticket__first-name');
    },
  },
  childTicketLastName: {
    get() {
      return $$('.cd-child-ticket__surname');
    },
  },
  childTicketFirstNameValidationError: {
    get() {
      return $('.cd-child-ticket__first-name-err');
    },
  },
  childTicketLastNameValidationError: {
    get() {
      return $('.cd-child-ticket__surname-err');
    },
  },
  childTicketDayOfBirth: {
    value(index) {
      let datePicker = $$('.cd-child-ticket__dob-picker-wrapper')[index];
      return datePicker.$$('select')[0];
    },
  },
  childTicketMonthOfBirth: {
    value(index) {
      let datePicker = $$('.cd-child-ticket__dob-picker-wrapper')[index];
      return datePicker.$$('select')[1];
    },
  },
  childTicketYearOfBirth: {
    value(index) {
      let datePicker = $$('.cd-child-ticket__dob-picker-wrapper')[index];
      return datePicker.$$('select')[2];
    },
  },
  childTicketDateOfBirthValidationError: {
    get() {
      return $('.cd-child-ticket__dob-err');
    },
  },
  childTicketGender: {
    value(index) {
      return $$('.cd-child-ticket__gender-selector select')[index];
    },
  },
  childOtherGender: {
    get() {
      return $('.cd-child-ticket__gender-selector input');
    },
  },
  childTicketGenderValidationError: {
    get() {
      return $('.gender-err');
    },
  },
  childTicketSelector: {
    value(selected, index = 0) {
      $$('.cd-child-ticket__ticket-selector .multiselect')[index].click();
      return $$(`//li[@class="multiselect__element"]/span[.="${selected}"]`);
    },
  },
  childTicketSelectorValidationError: {
    get() {
      return $('.cd-child-ticket__ticket-select-err');
    },
  },
});

module.exports = BookingParentData;
