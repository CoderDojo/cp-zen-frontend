import Vue from 'vue';

const DojosService = {
  getDojos: () => Vue.http.post(`${Vue.config.apiBase}/dojos`),
  getDojosByLatLong: (lat, long) => Vue.http.post(`${Vue.config.apiBase}/dojos/search-bounding-box`, {
    query: {
      lat,
      long,
      radius: 50,
    },
  }),
};

export default DojosService;
