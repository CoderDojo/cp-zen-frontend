const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-session__event-name');
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

});

module.exports = EventDetailsPage;
