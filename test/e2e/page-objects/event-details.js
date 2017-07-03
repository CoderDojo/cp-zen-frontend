const InfoColumn = require('./info-column');

const EventDetails = Object.create(InfoColumn, {
  bookEventTitle: {
    get() {
      return $('.cd-event-details__book-event-title');
    },
  },
  eventTitle: {
    get() {
      return $('.cd-event-details__event-title');
    },
  },
});

module.exports = EventDetails;
