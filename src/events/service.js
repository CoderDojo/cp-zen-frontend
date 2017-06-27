import Vue from 'vue';

const EventsService = {

  loadEvents(dojoId) {
    return Vue.http.post(`${Vue.config.apiBase}/events/search`,
      {
        query: { dojoId, filterPastEvents: true, status: 'published' },
      },
    );
  },
  loadEvent(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}`);
  },
  loadSessions(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}/sessions`);
  },
  bookTickets(applications) {
    applications.forEach((application) => {
      /* eslint-disable no-param-reassign */
      application.emailSubject = {
        received: 'Your ticket request for %1$s has been received',
        approved: 'Your ticket request for %1$s has been approved',
        cancelled: 'Your ticket request for %1$s has been cancelled',
      };
      /* eslint-enable no-param-reassign */
    });
    return Vue.http.post(`${Vue.config.apiBase}/events/bulk-apply-applications`, { applications });
  },
};

export default EventsService;
