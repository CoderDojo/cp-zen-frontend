const BasePage = require('./base-page');

const EventDetailsPage = Object.create(BasePage, {
  name: {
    get() {
      return $('.cd-event-session__event-name');
    },
  },
  nextButton: {
    get() {
      return $('.cd-event-sessions__next');
    },
  },
  eventSessions: {
    value(index) {
      return $$('.cd-event-sessions__session')[index];
    },
  },
  eventTickets: {
    value(index) {
      return $$('.cd-event-tickets__ticket')[index];
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
      $('.cd-number-spinner__increment').waitForVisible();
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
