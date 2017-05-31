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
  open: {
    value(eventId) {
      return BasePage.open.call(this, `/events/${eventId}`);
    },
  },

});

module.exports = EventDetailsPage;
