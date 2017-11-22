const EventDetails = require('./event-details');

const EventSessionsPage = Object.create(EventDetails, {
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
  noTicketSelectedError: {
    get() {
      return $('.cd-event-sessions__next-error');
    },
  },
  eventSessions: {
    get() {
      const selector = '.cd-event-sessions__session';
      $(selector).waitForVisible();
      return $$(selector);
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
  sessionsHeader: {
    get() {
      return $('.cd-event-sessions__header');
    },
  },
});

module.exports = EventSessionsPage;
