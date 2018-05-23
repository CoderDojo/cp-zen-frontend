import Vue from 'vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    applications: {},
  },
  mutations: {
    setApplications(state, { id, applications }) { // eslint-disable-next-line no-param-reassign
      Vue.set(state.applications, id, applications);
    },
    removeApplications(state, id) { // eslint-disable-next-line no-param-reassign
      Vue.delete(state.applications, id);
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
