import Vue from 'vue';

const EventsService = {

  loadEvents(dojoId) {
    return Vue.http.post(`${Vue.config.apiBase}/events/search`,
      {
        query: { dojoId },
      },
    );
  },
};

export default EventsService;
