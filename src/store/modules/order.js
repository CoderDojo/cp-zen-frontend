import Vue from 'vue';
import moment from 'moment';

export default {
  namespaced: true,
  state: {
    event: null,
    dojo: null,
  },
  mutations: {
    setEvent(state, event) {
      Vue.set(state, 'event', event);
    },
  },
  actions: {
    async loadEvent({ commit, dispatch }, eventId) {
      commit('setEvent', null);
      const event = (await Vue.http.get(`${Vue.config.apiServer}/api/3.0/events/${eventId}`,
        {
          params: {
            query: {
              afterDate: moment().unix(),
              utcOffset: moment().utcOffset(),
            },
            related: 'sessions.tickets',
          },
        })).body;
      commit('setEvent', event);
      dispatch('loadDojo', event.dojoId, { root: true });
    },
  },
  getters: {
    event: state => state.event,
  },
};
