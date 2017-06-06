<template>
  <div class="cd-find-dojo">
    <form @submit.prevent="searchDojosByAddress">
      <label for="addressSearch">Search dojos</label>
      <input type="text" name="addressSearch" id="addressSearch" v-model="searchCriteria">
      <input type="submit" value="Search Dojos"/>
    </form>
    <button @click="getCurrentLocation" class="cd-find-dojo__detect-location">Detect My Location</button>
    <p class=".cd-find-dojo__latitude" v-if="coordinates.latitude">Latitude: {{ coordinates.latitude }}</p>
    <p class=".cd-find-dojo__longitude" v-if="coordinates.longitude">Longitude: {{ coordinates.longitude }}</p>

    <dojoList v-if="dojos.length > 0" :dojos="dojos"></dojoList>
  </div>

</template>
<script>
  import DojoList from '@/dojos/cd-dojo-list';
  import DojosService from './service';

  export default {
    name: 'findDojo',
    props: ['lat', 'long'],
    data() {
      return {
        coordinates: {
          latitude: null,
          longitude: null,
        },
        searchCriteria: null,
        dojos: [],
      };
    },
    methods: {
      getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinates.latitude = position.coords.latitude;
          this.coordinates.longitude = position.coords.longitude;
          this.getDojosByLatLong();
        });
      },
      getDojosByLatLong() {
        DojosService.getDojosByLatLong(this.coordinates.latitude, this.coordinates.longitude)
          .then((response) => {
            this.dojos = response.body;
          });
      },
      searchDojosByAddress() {
        DojosService.getDojosByAddress(this.searchCriteria).then((response) => {
          this.dojos = response.body;
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
        this.getDojosByLatLong();
      }
    },
  };
</script>
