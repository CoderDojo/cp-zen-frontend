import Vue from 'vue';

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
      const event = (await Vue.http.get(`${Vue.config.apiServer}/api/2.0/events/${eventId}`)).body;
      commit('setEvent', event);
      dispatch('loadDojo', event.dojoId, { root: true });
    },
  },
  getters: {
    event: state => state.event,
  },
};
