import Vue from 'vue';

const EventsService = {

  loadEvents(dojoId) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/events/search`,
      {
        query: { dojoId, filterPastEvents: true, status: 'published' },
      },
    );
  },
  loadEvent(eventId) {
    return Vue.http.get(`${Vue.config.apiServer}/api/2.0/events/${eventId}`);
  },
  loadSessions(eventId) {
    return Vue.http.get(`${Vue.config.apiServer}/api/2.0/events/${eventId}/sessions`);
  },
  loadApplications(eventId) {
    return Vue.http.get(`${Vue.config.apiServer}/api/2.0/user/events/${eventId}/applications`);
  },
  manageTickets(applications) {
    applications.forEach((application) => {
      /* eslint-disable no-param-reassign */
      application.emailSubject = {
        received: 'Your ticket request for %1$s has been received',
        approved: 'Your ticket request for %1$s has been approved',
        cancelled: 'Your ticket request for %1$s has been cancelled',
      };
      /* eslint-enable no-param-reassign */
    });
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/events/bulk-apply-applications`, { applications });
  },
  v3: {
    get(dojoId, options) {
      return Vue.http.get(`${Vue.config.apiServer}/api/3.0/dojos/${dojoId}/events`, options);
    },
  },
};

export default EventsService;
