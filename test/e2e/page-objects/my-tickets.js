const BasePage = require('./base-page');

const MyTicketPage = Object.create(BasePage, {
  open: {
    value() {
      return BasePage.open.call(this, '/dashboard/tickets');
    },
  },
  events: {
    get() {
      return $$('.cd-user-ticket-list-item.cd-event-ticket-list__event');
    },
  },
  firstEvent: {
    get() {
      return $('.cd-user-ticket-list-item.cd-event-ticket-list__event');
    },
  },
  eventName: {
    value(index) {
      return $$('.cd-user-ticket-list-item.cd-event-ticket-list__event .cd-user-ticket-list-item__name')[index];
    },
  },
  eventDate: {
    value(index) {
      return $$('.cd-user-ticket-list-item.cd-event-ticket-list__event .cd-user-ticket-list-item__date-timestamp')[index];
    },
  },
  eventTime: {
    value(index) {
      return $$('.cd-user-ticket-list-item.cd-event-ticket-list__event .cd-user-ticket-list-item__times-timestamp')[index];
    },
  },
  tickets: {
    get() {
      return $$(`.cd-attendee`);
    },
  },
  ticketUsername: {
    value(index) {
      return $$(`.cd-attendee__username`)[index];
    },
  },
  ticketName: {
    value(index) {
      return $$(`.cd-attendee__ticket`)[index];
    },
  },
  ticketSession: {
    value(index) {
      return $$(`.cd-attendee__session`)[index];
    },
  },
  ticketStatus: {
    value(index) {
      return $$(`.cd-user-ticket-list-item__view-wrapper p`)[index];
    }
  },
  cancel: {
    value(index) {
      return $$(`.cd-user-ticket-list-item__view-cancel-button`)[index];
    }
  },
  book: {
    value(index) {
      return $$(`.cd-user-ticket-list-item__view`)[index];
    }
  },
});

module.exports = MyTicketPage;
