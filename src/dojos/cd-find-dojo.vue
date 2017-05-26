<template>
  <div class="cd-find-dojo">
    <button @click="getCurrentLocation" class="cd-find-dojo__detect-location">Detect My Location</button>
    <p v-if="coordinates.latitude && coordinates.longitude">Latitude: {{ coordinates.latitude }}, Longitude: {{
      coordinates.longitude }}</p>

    <dojoList v-if="coordinates.latitude && coordinates.longitude" v-bind:coordinates="coordinates"></dojoList>
  </div>

</template>
<script>
  import DojoList from '@/dojos/cd-dojo-list';

  export default {
    name: 'findDojo',
    props: ['lat', 'long'],
    data() {
      return {
        coordinates: {
          latitude: null,
          longitude: null,
        },
      };
    },
    methods: {
      getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinates.latitude = position.coords.latitude;
          this.coordinates.longitude = position.coords.longitude;
        });
      },
    },
    components: {
      dojoList: DojoList,
    },
    created() {
      if (this.lat && this.long) {
        this.coordinates.latitude = this.lat;
        this.coordinates.longitude = this.long;
      }
    },
  };
</script>
