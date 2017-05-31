var path = require('path');
const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-details__name');
    },
  },
  eventSessions: {
    value(index) {
      return $$('.cd-event-sessions__item')[index];
    },
  },
  eventTickets: {
    value(index) {
      return $$('.cd-event-tickets__item')[index];
    },
  },
  ticketCounterValue: {
    value(index) {
      return $$('.cd-number-spinner__value')[index];
    },
  },
  ticketCounterValues: {
    get() {
      return $$('.cd-number-spinner__value');
    },
  },
  ticketCounterIncrement: {
    value(index) {
      return $$('.cd-number-spinner__increment')[index];
    },
  },
  ticketCounterDecrement: {
    value(index) {
      return $$('.cd-number-spinner__decrement')[index];
    },
  },
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}`);
    },
  },

});

module.exports = EventDetailsPage;
