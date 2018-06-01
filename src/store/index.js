import Vue from 'vue';
import Vuex from 'vuex';
import order from './modules/order';

export default new Vuex.Store({
  state: {
    loggedInUser: null,
    dojo: null,
  },
  mutations: {
    setLoggedInUser(state, user) {
      Vue.set(state, 'loggedInUser', user);
    },
    setDojo(state, dojo) {
      Vue.set(state, 'dojo', dojo);
    },
  },
  actions: {
    async getLoggedInUser({ commit }) {
      commit('setLoggedInUser', null);
      const user = (await Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/instance`)).body;
      commit('setLoggedInUser', user);
    },
    async loadDojo({ commit }, dojoId) {
      commit('setDojo', null);
      const dojo = (await Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/${dojoId}`)).body;
      commit('setDojo', dojo);
    },
  },
  getters: {
    loggedInUser: state => state.loggedInUser.user,
    isLoggedIn: state => state.loggedInUser &&
      state.loggedInUser.ok &&
      state.loggedInUser.login !== null &&
      state.loggedInUser.login.id !== undefined,
    dojo: state => state.dojo,
  },
  modules: {
    order,
  },
});
