import Vue from 'vue';
import GeolocationService from '@/geolocation/service';

const radius = 50000;

const DojosService = {
  getDojos: query => Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos`, { query }),

  getByUrlSlug(urlSlug) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/find`,
      {
        query: { urlSlug },
      },
    );
  },
  getDojosByLatLong: (lat, lon) => Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/search-bounding-box`, {
    query: {
      lat,
      lon,
      radius,
    },
  }),

  getDojosByAddress(address) {
    return GeolocationService.getIpCountryDetails()
      .then(response => GeolocationService.geocode({
        address,
        region: response.body.country && response.body.country.iso_code,
      }))
      .then((results) => {
        const lat = results[0].geometry.location.lat();
        const long = results[0].geometry.location.lng();
        return this.getDojosByLatLong(lat, long);
      });
  },

  joinDojo(userId, dojoId, userTypes) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/save-usersdojos`, {
      userDojo: {
        userId,
        dojoId,
        userTypes,
        owner: 0,
      },
    });
  },
};

export default DojosService;
