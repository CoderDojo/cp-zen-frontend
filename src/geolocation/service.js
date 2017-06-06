import Vue from 'vue';

export default {
  gecoder: null,

  getIpCountryDetails: () => Vue.http.get(`${Vue.config.apiBase}/ip-country-details`),

  geocode(gecoderSearchOptions) {
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
  },
};
