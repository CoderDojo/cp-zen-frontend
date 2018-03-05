import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hasFutureEvents: null,
    hasPastEvents: null,
  },
  /* eslint-disable no-param-reassign */
  mutations: {
    setHasFutureEvents(state, status) {
      state.hasFutureEvents = status;
    },
    setHasPastEvents(state, status) {
      state.hasPastEvents = status;
    },
  },
  /* eslint-enable no-param-reassign */
});
