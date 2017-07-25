import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

export default {
  gecoder: null,

  getIpCountryDetails: async () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/ip-country-details`),

  async geocode(gecoderSearchOptions) {
    return VueGoogleMaps.loaded.then(() => {
      if (!this.geocoder) {
        this.geocoder = new google.maps.Geocoder();
      }
      return new Promise((resolve, reject) => {
        this.geocoder.geocode(gecoderSearchOptions, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(results);
          }
        });
      });
    });
  },

  async getLatitudeLongitudeByAddress(address) {
    const response = await this.getIpCountryDetails();
    const results = await this.geocode({
      address,
      region: response.body.country && response.body.country.iso_code,
    });
    return {
      latitude: results[0].geometry.location.lat(),
      longitude: results[0].geometry.location.lng(),
    };
  },
};
