<template>
  <div>
    <div class="row">
      <div class="cd-dojo-details__banner col-sm-12">
          <div>
            <img v-if="dojoDetails.id" v-img-fallback="{src: imageUrl, fallback: loadImage}"
                 class="img-circle cd-dojo-details__dojo-image"/>
          </div>
          <div class="cd-dojo-details__name align-middle">{{ dojoDetails.name }}</div>
        </div>
    </div>
    <div class="cd-dojo-details__container">
      <info-column class="cd-dojo-details__left-column">
        <info-column-section class="cd-dojo-details__left-column-section" icon="clock-o" :header="$t('Time')">
          {{ buildDojoFrequency(dojoDetails) }}
        </info-column-section>
        <info-column-section class="cd-dojo-details__left-column-section" icon="map-marker" :header="$t('Location')">
          {{ address }}
          <a class="cd-dojo-details__google-maps-link" target="_blank" rel="noopener noreferrer" v-if="dojoDetails.geoPoint" :href="googleMapsLink">{{ $t('Open in Google Maps') }} <i class="fa fa-chevron-right" aria-hidden="true"></i></a>
        </info-column-section>
        <info-column-section class="hidden-xs" icon="envelope-o" :header="$t('Email')">
          <a :href="'mailto:' + dojoDetails.email">{{ dojoDetails.email }}</a>
        </info-column-section>
        <info-column-section v-if="dojoDetails.website" class="hidden-xs" icon="globe" :header="$t('Website')">
          <a :href="dojoDetails.website | cdUrlFormatter" target="_blank" class="cd-dojo-details__website">{{ dojoDetails.website }}</a>
        </info-column-section>
        <info-column-section class="cd-dojo-details__social-media hidden-xs">
          <a v-if="dojoDetails.facebook" class="cd-dojo-details__social-media-icon fa fa-2x fa-facebook-square cd-dojo-details__facebook" :href="buildFacebookLink | cdUrlFormatter"></a>
          <a v-if="dojoDetails.twitter" class="cd-dojo-details__social-media-icon fa fa-2x fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="buildTwitterLink | cdUrlFormatter"></a>
          <a v-if="dojoDetails.googleGroup" class="cd-dojo-details__social-media-icon fa fa-2x fa-google cd-dojo-details__google-group sm-icon" aria-hidden="true" :href="dojoDetails.googleGroup"></a>
        </info-column-section>
      </info-column>
      <div class="cd-dojo-details__main_content">
        <dropdown v-if="canAdmin" class="cd-dojo-details__settings-dropdown" icon="gear" align="right">
          <li><a :href="`/dashboard/edit-dojo/${dojoDetails.id}`"><i class="fa fa-pencil"></i>{{ $t('Edit Dojo') }}</a></li>
          <li><a :href="`/dashboard/my-dojos/${dojoDetails.id}/users`"><i class="fa fa-users"></i>{{ $t('Manage Users') }}</a></li>
          <li><a :href="`/dashboard/my-dojos/${dojoDetails.id}/events`"><i class="fa fa-calendar"></i>{{ $t('Manage Events') }}</a></li>
        </dropdown>
        <div v-if="dojoDetails.private === 1" class="cd-dojo-details__private-notice">
          <div class="cd-dojo-details__private-notice-header">{{ $t('This is a Private Dojo') }}</div>
          <p>{{ $t('Private Dojos are by invite only or for specific people who are members of an organisation or school. The general public should not contact to attend this Dojo.') }}</p>
          <p v-html="$t('To learn more please email {email}', { email: '<a href=\'mailto:' + dojoDetails.email + '\'>' + dojoDetails.email + '</a>' })"></p>
        </div>
        <div class="cd-dojo-details__heading">{{ $t('Upcoming Events') }}</div>
        <events-list v-if="dojoDetails.id" v-bind:dojo="dojoDetails"></events-list>
        <div class="cd-dojo-details__heading">{{ $t('Details') }}</div>
        <a v-if="dojoDetails.geoPoint" :href="googleMapsLink" target="_blank">
          <static-map :google-api-key="googleMapsApiKey" :zoom="15" :markers="googleMapsMarker" :paths="googleMapsPath" scale="2"
          :center="`${dojoDetails.geoPoint.lat},${dojoDetails.geoPoint.lon}`" :size="[800, 225]" class="cd-dojo-details__static-map"></static-map>
        </a>
        <div class="cd-dojo-details__details" v-html="dojoDetails.notes"></div>
        <div class="visible-xs">
          <div class="cd-dojo-details__heading">{{ $t('Contact Dojo') }}</div>
          <div class="cd-dojo-details__contact">
            <info-column-section icon="envelope-o" :header="$t('Email')">
              <a :href="'mailto:' + dojoDetails.email">{{ dojoDetails.email }}</a>
            </info-column-section>
            <info-column-section v-if="dojoDetails.website" icon="globe" :header="$t('Website')">
              <a :href="dojoDetails.website | cdUrlFormatter" target="_blank" class="cd-dojo-details__website">{{ dojoDetails.website }}</a>
            </info-column-section>
            <info-column-section class="cd-dojo-details__social-media">
              <a v-if="dojoDetails.facebook" class="cd-dojo-details__social-media-icon fa fa-2x fa-facebook-square cd-dojo-details__facebook" :href="buildFacebookLink | cdUrlFormatter"></a>
              <a v-if="dojoDetails.twitter" class="cd-dojo-details__social-media-icon fa fa-2x fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="buildTwitterLink | cdUrlFormatter"></a>
              <a v-if="dojoDetails.googleGroup" class="cd-dojo-details__social-media-icon fa fa-2x fa-google cd-dojo-details__google-group sm-icon" aria-hidden="true" :href="dojoDetails.googleGroup"></a>
            </info-column-section>
          </div>
        </div>
        <div v-if="dojoDetails.supporterImage" class="cd-dojo-details__heading">
          {{ $t('Dojo supported by') }}
        </div>
        <div class="cd-dojo-details__sponsor-image">
          <img v-if="dojoDetails.supporterImage" :src="dojoDetails.supporterImage"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import StaticMap from 'vue-static-map';
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import InfoColumn from '@/common/cd-info-column';
  import Dropdown from '@/common/cd-dropdown';
  import InfoColumnSection from '@/common/cd-info-column-section';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import UserService from '@/users/service';
  import service from './service';
  import eventsList from '../events/cd-event-list';
  import DojoUtil from './util';

  /* eslint-disable global-require */
  export default {
    name: 'dojo-details',
    directives: {
      ImgFallback,
    },
    filters: {
      cdUrlFormatter,
    },
    components: {
      eventsList,
      InfoColumn,
      InfoColumnSection,
      Dropdown,
      StaticMap,
    },
    props: ['country', 'path'],
    data() {
      return {
        dojoDetails: {},
        user: {},
        googleMapsApiKey: Vue.config.googleMapsApiKey,
      };
    },
    computed: {
      address() {
        if (!this.dojoDetails.address1) {
          return this.dojoDetails.placeName ? this.dojoDetails.placeName : undefined;
        }
        return this.dojoDetails.address1;
      },
      urlSlug() {
        return `${this.country}/${this.path}`;
      },
      imageUrl() {
        return `https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${this.dojoDetails.id}`;
      },
      loadImage() {
        return require('../assets/avatars/dojo-default-logo.png');
      },
      googleMapsLink() {
        return `https://www.google.com/maps/search/?api=1&query=${this.dojoDetails.geoPoint.lat},${this.dojoDetails.geoPoint.lon}`;
      },
      // Custom marker will not display on localhost since GAPI needs a public link to the image
      googleMapsMarker() {
        const lat = this.dojoDetails.geoPoint.lat;
        const lng = this.dojoDetails.geoPoint.lon;
        return [
          {
            lat,
            lng,
            size: 'normal',
            icon: `${document.location.origin}${require('../assets/map/cd-dojo-pin_file.png')}`,
          },
        ];
      },
      // Path containing marker coordinates is needed for map marker to show on static map
      googleMapsPath() {
        const startLat = this.dojoDetails.geoPoint.lat;
        const endLng = this.dojoDetails.geoPoint.lon;
        return [
          {
            locations: [
                { startLat, endLng },
            ],
          },
        ];
      },
      canAdmin() {
        return !!(this.user && this.user.roles && this.user.roles.indexOf('cdf-admin') > -1);
      },
      buildTwitterLink() {
        const twitterData = this.dojoDetails.twitter;
        if (/^[a-zA-Z0-9_@]{1,15}$/.test(twitterData)) {
          return `https://twitter.com/${twitterData}`;
        }
        return twitterData;
      },
      buildFacebookLink() {
        const facebookData = this.dojoDetails.facebook;
        if (/^[a-zA-Z0-9.]{1,}$/.test(facebookData)) {
          return `https://facebook.com/${facebookData}`;
        }
        return facebookData;
      },
    },
    methods: {
      loadDojoDetails() {
        service.getByUrlSlug(this.urlSlug).then((response) => {
          this.dojoDetails = response.body;
        });
      },
      async loadCurrentUser() {
        const response = await UserService.getCurrentUser();
        this.user = response.body.user;
      },
      buildDojoFrequency: DojoUtil.buildDojoFrequency,
    },
    created() {
      this.loadDojoDetails();
      this.loadCurrentUser();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-dojo-details {

    &__dojo-image {
      width: 65px;
      height: 65px;
      vertical-align: text-top;
    }

    &__container {
      display:flex;
      margin: 0 -16px;
    }

    &__banner {
      background-color: @cd-purple;
      padding: 0 32px;
      min-height: 108px;
      display: flex;
      align-items: center;
    }

    &__name {
      font-size: 30px;
      color: @cd-white;
      margin-left: 16px;
      padding: 16px 0;
    }

    &__left-column {
      max-width: 340px;
      flex: 4;
    }

    &__main_content {
      position: relative;
      flex: 8;
      padding: 45px 32px 32px 16px;
    }

    &__website {
      word-wrap: break-word;
    }

    &__social-media {
      &-icon {
        text-decoration: none;
        margin-right: 16px;
      }

      .fa-facebook-square {
        color: #3b5998;
      }

      .fa-twitter-square {
        color: #4099ff;
      }

      .fa-google {
        color: #db3236;
      }
    }

    &__settings-dropdown {
      position: absolute;
      top: 8px;
      right: 32px;
      .fa {
        width: 16px;
        text-align: left;
      }
    }

    &__heading {
      color: #000;
      font-size: 18px;
      margin: 0 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;

      ~ .cd-dojo-details__heading {
        margin-top: 64px;
      }
    }

    &__sponsor-image {
      > img {
        max-width: 360px;
        max-height: 360px;
      }
    }

    &__google-maps-link {
      display: block;
      margin: 4px 0;
    }

    &__private-notice {
      margin-top: 45px;

      &-header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      > p {
        color: #686d6f;
      }
    }

    &__static-map {
      max-width: 100%;
      min-width: 100%;
      margin-bottom: 16px;
    }
  }

  .headerContent{
    line-height: 3;
  }

  @media (max-width: @screen-xs-max) {
    .cd-dojo-details {
      &__dojo-image {
        width: 42px;
        height: 42px;
      }
      &__banner {
        min-height: 74px;
        padding: 0 16px;
      }
      &__name {
        font-size: 21px;
      }
      &__container {
        flex-direction: column;
      }
      &__left-column {
        text-align: center;
        max-width: none;

        &-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      }
      &__main_content {
        padding: 45px 16px 0 16px;
      }
      &__sponsor-image {
        text-align: center;
        > img {
          width: 100%;
        }
      }

      &__settings-dropdown {
        right: 16px;
      }
    }
  }
</style>
