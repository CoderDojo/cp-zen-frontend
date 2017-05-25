<template>
  <div class="cd-find-dojo">
    <button @click="getCurrentLocation" class="cd-find-dojo__detect-location">Detect My Location</button>
    <p v-if="latitude && longitude">Latitude: {{ latitude }}, Longitude: {{ longitude }}</p>
  </div>
</template>
<script>
  export default {
    name: 'findDojo',
    data() {
      return {
        latitude: null,
        longitude: null,
      };
    },
    methods: {
      getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        });
      },
    },
  };
</script>
