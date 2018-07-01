const EventSessionsPage = require('./event-details');

const ChildTicket = Object.create(EventSessionsPage, {
  ticketBox: {
    get() {
      return $('.cd-child-ticket__ticket-box');
    },
  },
  deleteTicket: {
    get() {
      return $('.cd-child-ticket__delete-ticket');
    },
  },
});

module.exports = ChildTicket;
