import Vue from 'vue';
import { mapKeys, camelCase } from 'lodash';
import GeolocationService from '@/geolocation/service';

const radius = 50000;

const DojosService = {
  getDojoById: id => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/${id}`),

  getDojos: query => Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos`, { query }),

  getUsersDojos(userId, dojoId) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/users`, {
      query: {
        userId,
        dojoId,
      },
    });
  },

  getByUrlSlug(urlSlug) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/find`,
      {
        query: { urlSlug },
      },
    );
  },
  async getDojosByLatLong(lat, lon) {
    const dojos = [];
    const response = await Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/search-bounding-box`, {
      query: {
        lat,
        lon,
        radius,
      },
    });
    response.body.forEach((snakeCaseDojo) => {
      dojos.push(mapKeys(snakeCaseDojo, (value, key) => camelCase(key)));
    });
    response.body = dojos;
    return response;
  },
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
