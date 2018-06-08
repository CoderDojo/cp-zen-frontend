import Vue from 'vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    applications: {},
  },
  mutations: {
    setApplications(state, { id, applications }) {
      Vue.set(state.applications, id, applications);
    },
    removeApplications(state, id) {
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
