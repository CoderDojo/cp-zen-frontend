import Vue from 'vue';

const DojosService = {
  getDojos: () => Vue.http.post(`${Vue.config.apiBase}/dojos`),
};

export default DojosService;
