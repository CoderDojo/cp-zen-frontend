import Vue from 'vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    applications: {},
  },
  mutations: {
    setApplications(state, data) { // eslint-disable-next-line no-param-reassign
      Vue.set(state.applications, data.id, data);
    },
  },
  getters: {
    applications: (state) => {
      const applications = (Object.values(state.applications))
        .reduce((red, apps) => red.concat(apps), []);
      return applications;
    },
  },
});
export default store;
