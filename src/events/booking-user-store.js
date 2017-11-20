import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: null,
  },
  /* eslint-disable no-param-reassign */
  mutations: {
    setEmail(state, email) {
      state.email = email;
    },
  },
  /* eslint-enable no-param-reassign */
});
