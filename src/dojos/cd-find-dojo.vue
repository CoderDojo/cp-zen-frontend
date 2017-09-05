<template>
  <div class="cd-find-dojo">
    <div class="cd-find-dojo__panel" :class="{ 'cd-find-dojo__panel--reduced': searchExecuted }">
      <form class="cd-find-dojo__panel-form" :class="{ 'cd-find-dojo__panel-form--reduced': searchExecuted }" @submit.prevent="$router.push({ query: { q: searchCriteria, p: 1 } });">
        <h1 v-if="!searchExecuted" class="cd-find-dojo__panel-form-header">{{ $t('Find a Dojo to attend') }}</h1>
        <p v-if="!searchExecuted" class="cd-find-dojo__panel-form-info">{{ $t('Learn technology in an informal, creative and social environment. Find a dojo near you.') }}</p>
        <div v-if="searchExecuted" class="cd-find-dojo__panel-form-header--reduced hidden-xs">{{ $t('{total} Dojos found near {query}', {total: dojos.length, query: queryString}) }}</div>
        <div v-if="searchExecuted" class="cd-find-dojo__panel-form-header--reduced visible-xs">{{ $t('{total} Dojos found', {total: dojos.length}) }}</div>
        <div class="cd-find-dojo__panel-form-search">
          <div class="cd-find-dojo__panel-form-search-input" :class="{ 'cd-find-dojo__panel-form-search-input--reduced': searchExecuted }">
            <input type="text" name="addressSearch" class="form-control input-lg" :placeholder="$t('Enter your city or locality')" v-model="searchCriteria" autofocus>
          </div>
          <div class="cd-find-dojo__panel-form-search-submit hidden-xs">
            <input type="submit" class="btn btn-lg" :value="$t('Search for Dojos')"/>
          </div>
          <div v-if="!searchExecuted" class="cd-find-dojo__panel-form-search-submit visible-xs">
            <input type="submit" class="btn btn-lg" :value="$t('Search for Dojos')"/>
          </div>
          <span v-else class="cd-find-dojo__panel-form-search-submit--reduced visible-xs">
            <button type="submit" class="btn btn-lg fa fa-arrow-right"/>
          </span>
        </div>
        <router-link tag="button" :to="{ query: { currentLocation: true, p: 1 } }" class="cd-find-dojo__panel-form-detect-location hidden-xs">
          <i class="fa fa-location-arrow" aria-hidden="true" v-show="!detectingLocation"></i>
          <i class="fa fa-spinner fa-spin" aria-hidden="true" v-show="detectingLocation"></i>
          {{ $t('Detect my location') }}
        </router-link>
        <router-link tag="button" :to="{ query: { currentLocation: true } }"
          :class="{ 'cd-find-dojo__panel-form-detect-location--reduced': searchExecuted }"
          class="cd-find-dojo__panel-form-detect-location visible-xs">
          <i class="fa fa-location-arrow" aria-hidden="true" v-show="!detectingLocation"></i>
          <i class="fa fa-spinner fa-spin" aria-hidden="true" v-show="detectingLocation"></i>
          {{ $t('Detect my location') }}
        </router-link>
      </form>
      <div v-if="!searchExecuted" class="cd-find-dojo__panel-illustration">
        <img src="../assets/characters/ninjas/ninja-female-2-laptop-sitting.svg" />
      </div>
    </div>
    <div v-if="searchExecuted" class="cd-find-dojo__results-header cd-find-dojo__results-header--mobile">
      <span>{{ $t('Showing {firstOnPage} to {lastOnPage} of {total} Dojos', { firstOnPage: firstOnPage, lastOnPage: lastOnPage, total: dojos.length }) }}</span>
      <button class="cd-find-dojo__results-header-map-toggle btn btn-link" @click="toggleMap"><i class="fa fa-map-o" aria-hidden="true"></i> {{ showMap ? $t('Hide Map') : $t('Show Map') }}</button>
    </div>
    <div v-if="searchExecuted" class="cd-find-dojo__results">
      <div class="cd-find-dojo__results-list">
        <div class="cd-find-dojo__results-header hidden-xs">
          <span>{{ $t('Showing {firstOnPage} to {lastOnPage} of {total} Dojos', { firstOnPage: firstOnPage, lastOnPage: lastOnPage, total: dojos.length }) }}</span>
        </div>
        <dojo-list :dojos="dojos"></dojo-list>
        <h4 v-if="dojos.length === 0" class="cd-find-dojo__no-results-message">
          <no-results-desktop class="cd-find-dojo__no-results-message--desktop hidden-xs"></no-results-desktop>
          <no-results-mobile @toggleMap="toggleMap" class="cd-find-dojo__no-results-message--mobile visible-xs"></no-results-mobile>
        </h4>
      </div>
      <div class="cd-find-dojo__right-column">
        <dojo-map :center="coordinates" class="cd-find-dojo__results-map" :class="{'cd-find-dojo__results-map--hidden': !showMap }" :dojos="allActiveDojos"></dojo-map>
        <div class="cd-find-dojo__start-a-dojo-box hidden-xs">
          <div class="cd-find-dojo__start-a-dojo-message">
            {{ $t('Don\'t see a Dojo in your area?') }}
          </div>
          <a class="cd-find-dojo__start-a-dojo-button" href="/dashboard/start-dojo">
            {{ $t('Start a Dojo') }}
          </a>
        </div>
      </div>
    </div>
    <div class="cd-find-dojo__start-a-dojo-box visible-xs">
      <div class="cd-find-dojo__start-a-dojo-message">
        {{ $t('Don\'t see a Dojo in your area?') }}
      </div>
      <a class="cd-find-dojo__start-a-dojo-button" href="/dashboard/start-dojo">
        {{ $t('Start a Dojo') }}
      </a>
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
  import dojoPaginationStore from './dojo-pagination-store';

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
      firstOnPage() {
        const page = dojoPaginationStore.state.page;
        const dojosPerPage = dojoPaginationStore.state.dojosPerPage;
        const firstOnPage = ((page - 1) * dojosPerPage) + 1;
        return firstOnPage <= this.dojos.length && firstOnPage > 0 ? firstOnPage : 0;
      },
      lastOnPage() {
        const lastOnPage = this.firstOnPage + (dojoPaginationStore.state.count - 1);
        return lastOnPage > 0 ? lastOnPage : 0;
      },
      queryString() {
        return this.$route.query.q ? `‘${this.$route.query.q}’` : this.$t('you');
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
          fields$: ['name', 'geo_point', 'stage', 'url_slug', 'private', 'start_time', 'end_time', 'frequency', 'alternative_frequency', 'day'],
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

      &--reduced {
        max-height: 200px;
      }

      &-form {
        flex: 3;
        padding: 48px 32px 96px;

        &--reduced {
          padding: 24px 24px 40px;
        }

        &-header {
          font-size: 40px;
          font-weight: 300;
          margin-bottom: 4px;

          &--reduced {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
          }
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
            margin-right: 8px;
            min-width: 460px;

            &--reduced {
              min-width: 310px;
            }
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
          margin: 16px 0;
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
    &__start-a-dojo {
      &-box {
        margin-top: 32px;
        padding: 24px 80px;
        border: solid 1px @cd-orange;
        text-align: center;
        border-bottom: solid 3px @cd-orange;
      }
      &-message {
        font-size: 18px;
        margin-bottom: 16px;
      }
      &-button {
        margin-top: 16px;
        padding: 12px 50px;
        text-decoration: none;
        color: @cd-orange;
        font-size: 16px;
        border: solid 1px @cd-orange;
        &:hover {
          background-color: @cd-orange;
          color: white;
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
        flex: 7;
        margin-right: 16px;
      }

      &-right-column {
        flex: 5;
      }

      &-map {
        margin-top: 32px;
        min-width: auto;
        min-height: auto;
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
        &--reduced {
          justify-content: center;
        }
        &-illustration {
          display: none;
        }
        &-form {
          padding: 64px 16px 64px;

          &--reduced {
            padding: 16px 8px;
            width: 100%
          }

          &-header {
            font-size: 30px;

            &--reduced {
              text-align: center;
              font-size: 18px;
            }
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

              &--reduced {
                max-width: 80%;
                margin-right: 4px;
              }
            }
            &-submit {
              margin-top: 8px;
              > .btn {
                width: 100%;
              }
              &--reduced {
                margin-top: none;
                flex: 1;
                > .btn {
                  background: #2a8244;
                  width: 100%;
                  &:hover {
                    background: #154c25;
                    color: @cd-white;
                  }
                }
              }
            }
          }

          &-detect-location {
            width: 100%;
            &--reduced {
              width: auto;
              margin: 16px 0 0 0;
            }
          }
        }
      }

      &__start-a-dojo {
        &-box {
          padding: 28px 32px;
          margin-bottom: 16px;
        }
        &-message {
          font-size: 16px;
          margin-bottom: 24px;
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
