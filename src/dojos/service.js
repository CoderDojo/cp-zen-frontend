import Vue from 'vue';

const radius = 50000;

const DojosService = {
  getDojos: () => Vue.http.post(`${Vue.config.apiBase}/dojos`),

  getByUrlSlug(urlSlug) {
    return Vue.http.post(`${Vue.config.apiBase}/dojos/find`,
      {
        query: { urlSlug },
      },
    );
  },
  getDojosByLatLong: (lat, lon) => Vue.http.post(`${Vue.config.apiBase}/dojos/search-bounding-box`, {
    query: {
      lat,
      lon,
      radius,
    },
  }),
};

export default DojosService;
