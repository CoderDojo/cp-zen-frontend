import Vue from 'vue';

const EventsService = {

  loadEvents(dojoId) {
    return Vue.http.post(`${Vue.config.apiBase}/events/search`,
      {
        query: { dojoId },
      },
    );
  },
  loadEvent(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}`);
  },
  loadSessions(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}/sessions`);
  },
};

export default EventsService;
