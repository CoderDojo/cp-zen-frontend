<template>
  <div class="cd-find-dojo">
    <div class="cd-find-dojo__panel">
      <form class="cd-find-dojo__panel-form" @submit.prevent="searchDojosByAddress">
        <h1 class="cd-find-dojo__panel-form-header">Find a Dojo to attend</h1>
        <p class="cd-find-dojo__panel-form-info">Learn technology in an informal, creative and social environment. Find a dojo near you.</p>
        <div class="cd-find-dojo__panel-form-search">
          <div class="cd-find-dojo__panel-form-search-input">
            <input type="text" name="addressSearch" class="form-control input-lg" placeholder="Enter your city or locality" v-model="searchCriteria">
          </div>
          <div class="cd-find-dojo__panel-form-search-submit">
            <input type="submit" class="btn btn-lg" value="Search Dojos"/>
          </div>
        </div>
        <button @click.prevent="getCurrentLocation" class="cd-find-dojo__panel-form-detect-location">
          <i class="fa fa-location-arrow" aria-hidden="true" v-show="!detectingLocation"></i>
          <i class="fa fa-spinner fa-spin" aria-hidden="true" v-show="detectingLocation"></i>
          Detect My Location
        </button>
      </form>
      <div class="cd-find-dojo__panel-illustration">
        <img src="../assets/characters/ninjas/ninja-female-2-laptop-sitting.svg" />
      </div>
    </div>
    <div v-if="dojos.length > 0" class="cd-find-dojo__results">
      <dojo-list class="cd-find-dojo__results-list" :dojos="dojos"></dojo-list>
      <dojo-map :center="coordinates" class="cd-find-dojo__results-map" :dojos="dojos" style="width: 400px;height: 400px;"></dojo-map>
    </div>
  </div>

</template>
<script>
  import DojoList from '@/dojos/cd-dojo-list';
  import DojoMap from '@/dojos/cd-dojo-map';
  import GeolocationService from '@/geolocation/service';
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
        detectingLocation: false,
      };
    },
    methods: {
      getCurrentLocation() {
        this.detectingLocation = true;
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinates.latitude = position.coords.latitude;
          this.coordinates.longitude = position.coords.longitude;
          this.getDojosByLatLong();
        }, () => {
          this.detectingLocation = false;
        });
      },
      getDojosByLatLong() {
        DojosService.getDojosByLatLong(this.coordinates.latitude, this.coordinates.longitude)
          .then((response) => {
            this.detectingLocation = false;
            this.dojos = response.body;
          });
      },
      searchDojosByAddress() {
        GeolocationService.getLatitudeLongitudeByAddress(this.searchCriteria)
          .then((coords) => {
            this.coordinates = coords;
            this.getDojosByLatLong();
          });
      },
    },
    components: {
      DojoList,
      DojoMap,
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
<style scoped lang="less">
  @import "~cd-common/common/_colors";

  .cd-find-dojo {
    &__panel {
      display: flex;
      background: @cd-green;
      color: @cd-white;
      margin: -16px -16px 0 -16px;

      &-form {
        flex: 3;
        padding: 64px 32px;

        &-header {
          font-size: 40px;
          font-weight: 300;
        }

        &-info {
          font-size: 18px;
          font-weight: 300;
        }

        &-search {
          display: flex;
          flex-wrap: wrap;

          &-input {
            flex: 1;
            margin-right: 8px;
            min-width: 460px;
          }

          &-submit {
            flex: 1;
            > .btn {
              background: #2a8244;
            }
          }
        }

        &-detect-location {
          display: inline-block;
          color: @cd-white;
          margin: 8px 0;
          cursor: pointer;
          background: none;
          border: none;

          &:hover {
            color: @cd-white;
            text-decoration: underline;
          }
        }
      }

      &-illustration {
        flex: 1;
        align-self: flex-end;
        padding: 0 32px;
        transform: rotateY(180deg) translateY(15%);
      }
    }
    &__results {
     display: flex;
     padding: 32px 16px;
      &-list {
        flex: 7
      }

      &-map {
        flex: 5;
        padding-left: 16px;
      }
    }
  }
</style>
