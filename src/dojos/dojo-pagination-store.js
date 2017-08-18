import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: 1,
    count: 0,
    dojosPerPage: 6,
  },
  /* eslint-disable no-param-reassign */
  mutations: {
    setPage(state, page) {
      state.page = page;
    },
    setCount(state, count) {
      state.count = count;
    },
  },
  /* eslint-enable no-param-reassign */
});
