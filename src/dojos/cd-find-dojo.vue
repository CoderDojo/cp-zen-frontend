<template>
  <div class="cd-find-dojo">
    <div class="cd-find-dojo__panel">
      <form class="cd-find-dojo__panel-form" @submit.prevent="$router.push({ query: { q: searchCriteria } });">
        <h1 class="cd-find-dojo__panel-form-header">{{ $t('Find a Dojo to attend') }}</h1>
        <p class="cd-find-dojo__panel-form-info">{{ $t('Learn technology in an informal, creative and social environment. Find a dojo near you.') }}</p>
        <div class="cd-find-dojo__panel-form-search">
          <div class="cd-find-dojo__panel-form-search-input">
            <input type="text" name="addressSearch" class="form-control input-lg" :placeholder="$t('Enter your city or locality')" v-model="searchCriteria" autofocus>
          </div>
          <div class="cd-find-dojo__panel-form-search-submit">
            <input type="submit" class="btn btn-lg" :value="$t('Search for Dojos')"/>
          </div>
        </div>
        <router-link tag="button" :to="{ query: { currentLocation: true } }" class="cd-find-dojo__panel-form-detect-location">
          <i class="fa fa-location-arrow" aria-hidden="true" v-show="!detectingLocation"></i>
          <i class="fa fa-spinner fa-spin" aria-hidden="true" v-show="detectingLocation"></i>
          {{ $t('Detect my location') }}
        </router-link>
      </form>
      <div class="cd-find-dojo__panel-illustration">
        <img src="../assets/characters/ninjas/ninja-female-2-laptop-sitting.svg" />
      </div>
    </div>
    <div v-if="searchExecuted" class="cd-find-dojo__results-header cd-find-dojo__results-header--mobile">
      <span>{{ $t('Showing {total} Dojos', { total: dojos.length }) }}</span>
      <button class="cd-find-dojo__results-header-map-toggle btn btn-link" @click="toggleMap"><i class="fa fa-map-o" aria-hidden="true"></i> {{ showMap ? $t('Hide Map') : $t('Show Map') }}</button>
    </div>
    <div v-if="searchExecuted" class="cd-find-dojo__results">
      <div class="cd-find-dojo__results-list">
        <div class="cd-find-dojo__results-header hidden-xs">
          <span>{{ $t('Showing {total} Dojos', { total: dojos.length }) }}</span>
        </div>
        <dojo-list :dojos="dojos"></dojo-list>
        <h4 v-if="dojos.length === 0" class="cd-find-dojo__no-results-message">
          <no-results-desktop class="cd-find-dojo__no-results-message--desktop hidden-xs"></no-results-desktop>
          <no-results-mobile @toggleMap="toggleMap" class="cd-find-dojo__no-results-message--mobile visible-xs"></no-results-mobile>
        </h4>
      </div>
      <dojo-map :center="coordinates" :class="{ 'cd-find-dojo__results-map': true, 'cd-find-dojo__results-map--hidden': !showMap }" :dojos="allActiveDojos"></dojo-map>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import DojoList from '@/dojos/cd-dojo-list';
  import DojoMap from '@/dojos/cd-dojo-map';
  import GeolocationService from '@/geolocation/service';
  import translationComponentGenerator from '@/common/cd-translation-component-generator';
  import DojosService from './service';

  const noResultsString = 'Try modifying your search location, or zoom out on the {openLink}map{closeLink} to find the nearest Dojos.';
  const NoResultsDesktop = translationComponentGenerator(noResultsString, {
    openLink: '',
    closeLink: '',
  });
  const NoResultsMobile = translationComponentGenerator(noResultsString, {
    openLink: '<a @click="$emit(\'toggleMap\')">',
    closeLink: '</a>',
  });

  export default {
    name: 'findDojo',
    props: ['lat', 'long'],
    data() {
      return {
        coordinates: {
          latitude: null,
          longitude: null,
        },
        searchExecuted: false,
        searchCriteria: null,
        dojos: [],
        allDojos: [],
        detectingLocation: false,
        showMap: false,
      };
    },
    computed: {
      allActiveDojos() {
        return this.allDojos.filter(dojo => dojo.stage !== 4);
      },
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
        this.searchExecuted = true;
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
      getAllDojos() {
        const query = {
          verified: 1,
          deleted: 0,
          fields$: ['name', 'geo_point', 'stage', 'url_slug', 'private', 'startTime', 'endTime', 'frequency', 'alternativeFrequency', 'day'],
        };
        DojosService.getDojos(query).then((response) => {
          this.allDojos = response.body;
        });
      },
      toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
          Vue.$gmapDefaultResizeBus.$emit('resize');
        }
      },
    },
    components: {
      DojoList,
      DojoMap,
      NoResultsDesktop,
      NoResultsMobile,
    },
    watch: {
      $route(newRoute) {
        if (newRoute.query.q) {
          this.searchCriteria = newRoute.query.q;
          this.searchDojosByAddress();
        } else if (newRoute.query.currentLocation) {
          this.getCurrentLocation();
        } else {
          this.searchExecuted = false;
          this.searchCriteria = null;
        }
      },
    },
    created() {
      if (this.lat && this.long) {
        this.coordinates.latitude = this.lat;
        this.coordinates.longitude = this.long;
        this.getDojosByLatLong();
      }
      if (this.$route.query.q) {
        this.searchCriteria = this.$route.query.q;
        this.searchDojosByAddress();
      } else if (this.$route.query.currentLocation) {
        this.getCurrentLocation();
      }
      this.getAllDojos();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-find-dojo {
    &__panel {
      display: flex;
      background: @cd-green;
      color: @cd-white;
      margin: 0 -16px;

      &-form {
        flex: 3;
        padding: 48px 32px 96px;

        &-header {
          font-size: 40px;
          font-weight: 300;
          margin-bottom: 4px;
        }

        &-info {
          font-size: 18px;
          font-weight: 300;
          margin-bottom: 32px;
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

              &:hover {
                background: #154c25;
                color: @cd-white;
              }
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
        img {
          max-width: 240px;
        }
      }
    }
    &__results {
     display: flex;
     padding: 0 16px 32px 16px;

      &-header {
        border-bottom: solid 1px #bebebe;
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &--mobile {
          display: none;
        }

        > span {
          font-size: 14px;
          color: #a2a1a0;
          font-weight: 200;
          padding: 8px 0;
        }
      }

      &-list {
        flex: 7
      }

      &-map {
        flex: 5;
        padding-left: 16px;
        margin-top: 32px;
      }
    }

    &__no-results-message {
      flex: 7;
      margin: 16px 0;

      &--mobile {
        font-size: 16px;

      }
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-find-dojo {
      &__panel {
        &-illustration {
          display: none;
        }
        &-form {
          padding: 64px 16px 64px;

          &-header {
            font-size: 30px;
          }

          &-info {
            font-size: 14px;
          }

          &-search {
            &-input {
              width: 100%;
              flex: none;
              margin-right: 0;
              min-width: auto;
            }
            &-submit {
              margin-top: 8px;
              > .btn {
                width: 100%;
              }
            }
          }

          &-detect-location {
            width: 100%;
            margin-top: 16px;
          }
        }
      }

      &__results {
        flex-direction: column-reverse;
        padding: 0 0 32px 0;

        &-header {
          &--mobile {
            display: flex;
          }
          &-map-toggle {
            > .fa {
              margin-right: 4px;
            }
          }
        }

        &-map {
          padding-left: 0;
          margin-top: 8px;

          &--hidden {
            display: none;
          }
        }
      }
    }
  }
</style>
