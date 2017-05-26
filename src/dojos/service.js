import Vue from 'vue';

const DojosService = {
  getDojos: () => Vue.http.post(`${Vue.config.apiBase}/dojos`),
  getDojosByLatLong: (lat, lon) => Vue.http.post(`${Vue.config.apiBase}/dojos/search-bounding-box`, {
    query: {
      lat,
      lon,
      radius: 50,
    },
  }),
};

export default DojosService;
