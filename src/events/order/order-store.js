import Vue from 'vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    applications: {},
    isNewUser: false,
    isNewDojoMember: false,
  },
  mutations: {
    setIsNewUser(state, bool) { // eslint-disable-next-line no-param-reassign
      state.isNewUser = bool;
    },
    setIsNewDojoMember(state, bool) { // eslint-disable-next-line no-param-reassign
      state.isNewDojoMember = bool;
    },
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
