import Vue from 'vue';

const state = {
  chosenLanguageConfig: null,
};

export const mutations = {
  setChosenLanguageConfig(state, chosenLanguageConfig) {
    Vue.set(state, 'chosenLanguageConfig', chosenLanguageConfig);
  },
};

export const actions = {
  updateChosenLanguageConfig({ commit }, chosenLanguageConfig) {
    commit('setChosenLanguageConfig', chosenLanguageConfig);
  },
}

export const getters = {
  chosenLanguageConfig: state => state.chosenLanguageConfig,
}

export default {
  namespaced: false,
  state,
  mutations,
  actions,
  getters,
};
