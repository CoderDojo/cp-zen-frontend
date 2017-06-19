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

  getLatitudeLongitudeByAddress(address) {
    return this.getIpCountryDetails()
      .then(response => this.geocode({
        address,
        region: response.body.country && response.body.country.iso_code,
      }))
      .then(results => Promise.resolve({
        latitude: results[0].geometry.location.lat(),
        longitude: results[0].geometry.location.lng(),
      }));
  },
};
