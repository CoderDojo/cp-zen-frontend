<template>
  <div v-title="dojoDetails.name">
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
          <ics-link :dojo-id="dojoDetails.id"/>
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
        <dropdown v-if="isDojoAdmin || isTicketingAdmin" class="cd-dojo-details__settings-dropdown" icon="gear" align="right">
          <li v-if="isDojoAdmin"><a :href="`/dashboard/edit-dojo/${dojoDetails.id}`"><i class="fa fa-pencil"></i>{{ $t('Edit Dojo') }}</a></li>
          <li v-if="isDojoAdmin"><a :href="`/dashboard/my-dojos/${dojoDetails.id}/users`"><i class="fa fa-users"></i>{{ $t('Manage Users') }}</a></li>
          <li v-if="isTicketingAdmin"><a :href="`/dashboard/my-dojos/${dojoDetails.id}/events`"><i class="fa fa-calendar"></i>{{ $t('Manage Events') }}</a></li>
        </dropdown>
        <div v-if="dojoDetails.private === 1" class="cd-dojo-details__private-notice">
          <div class="cd-dojo-details__private-notice-header">{{ $t('This is a Private Dojo') }}</div>
          <p>{{ $t('Private Dojos are by invite only or for specific people who are members of an organisation or school. The general public should not contact to attend this Dojo.') }}</p>
          <p v-html="$t('To learn more please email {email}', { email: '<a href=\'mailto:' + dojoDetails.email + '\'>' + dojoDetails.email + '</a>' })"></p>
        </div>
        <section class="cd-dojo-details__section">
          <events-list v-if="dojoDetails.id" v-bind:dojo="dojoDetails"></events-list>
        </section>
        <section class="cd-dojo-details__section">
          <div class="cd-dojo-details__heading">{{ $t('Details') }}</div>
          <a v-if="dojoDetails.geoPoint" :href="googleMapsLink" target="_blank">
            <static-map :google-api-key="googleMapsApiKey" :zoom="15" :markers="googleMapsMarker" :paths="googleMapsPath" scale="2"
            :center="`${dojoDetails.geoPoint.lat},${dojoDetails.geoPoint.lon}`" :size="[800, 225]" class="cd-dojo-details__static-map"></static-map>
          </a>
          <div class="cd-dojo-details__details" v-html="dojoDetails.notes"></div>
        </section>
        <section v-if="user && !dojoDetails.private" class="cd-dojo-details__section">
          <div class="cd-dojo-details__heading">{{ $t('Volunteer at this Dojo') }}</div>
          <div class="cd-dojo-details__sub-heading">{{ $t('Mentor') }} <span v-if="dojoDetails.needMentors" class="cd-dojo-details__heading-label">{{ $t('This Dojo needs Mentors!') }}</span></div>
          <div class="cd-dojo-details__section-text">{{ $t('Mentors help the Ninjas with programming, while also helping the Champion run the Dojo efficiently') }}</div>
          <button @click="volunteer('mentor')" class="cd-dojo-details__volunteer-button" v-ga-track-click="'volunteer_as_mentor'">{{ $t('Volunteer as Mentor') }}</button>
          <div class="cd-dojo-details__sub-heading">{{ $t('Champion') }}</div>
          <div class="cd-dojo-details__section-text">{{ $t('The Champion handles every aspect of running the Dojo - from handing logistics to ticketing, to awarding badges to the Ninjas') }}</div>
          <button @click="volunteer('champion')" class="cd-dojo-details__volunteer-button" v-ga-track-click="'volunteer_as_champion'">{{ $t('Volunteer as Champion') }}</button>
        </section>
        <section class="cd-dojo-details__section visible-xs">
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
        </section>
        <section class="cd-dojo-details__section">
          <div v-if="dojoDetails.supporterImage" class="cd-dojo-details__heading">
            {{ $t('Dojo supported by') }}
          </div>
          <div class="cd-dojo-details__sponsor-image">
            <img v-if="dojoDetails.supporterImage" :src="dojoDetails.supporterImage"/>
          </div>
        </section>
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
  import IcsLink from '@/events/cd-ics-link';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import UserService from '@/users/service';
  import UsersDojosService from '@/usersDojos/service';
  import UsersDojosUtil from '@/usersDojos/util';
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
      IcsLink,
      Dropdown,
      StaticMap,
    },
    props: ['id', 'country', 'path'],
    data() {
      return {
        dojoDetails: {},
        user: {},
        usersDojos: [],
        googleMapsApiKey: Vue.config.googleMapsApiKey,
        _country: null,
        _path: null,
      };
    },
    computed: {
      address() {
        if (!this.dojoDetails.address1) {
          return this.dojoDetails.placeName ? this.dojoDetails.placeName : undefined;
        }
        return this.dojoDetails.address1;
      },
      urlSlug: {
        get() {
          return `${this._country}/${this._path}`;
        },
        set(val) {
          if (val) {
            this._country = val.substring(0, 2);
            this._path = val.substring(3, val.length);
          } else {
            this._country = null;
            this._path = null;
          }
        },
      },
      imageUrl() {
        return DojoUtil.imageUrl(this.dojoDetails.id);
      },
      loadImage: DojoUtil.fallbackImage,
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
      isCDFAdmin() {
        return !!(this.user && this.user.roles && this.user.roles.indexOf('cdf-admin') > -1);
      },
      isDojoAdmin() {
        return this.isCDFAdmin || UsersDojosUtil.hasPermission(this.usersDojos, 'dojo-admin');
      },
      isTicketingAdmin() {
        return this.isCDFAdmin || UsersDojosUtil.hasPermission(this.usersDojos, 'ticketing-admin');
      },
    },
    methods: {
      async loadDojoDetails() {
        if (this.id) {
          const response = await service.getDojoById(this.id);
          this.dojoDetails = response.body;
          this.urlSlug = this.dojoDetails.urlSlug;
          this.redirectToSlug();
        } else {
          const response = await service.getByUrlSlug(this.urlSlug);
          this.dojoDetails = response.body;
        }
      },
      async loadCurrentUser() {
        const response = await UserService.getCurrentUser();
        this.user = response.body.user;
      },
      async loadUserDojoRelationship() {
        if (this.user && this.user.id) {
          const response = await UsersDojosService.getUsersDojos(this.user.id, this.dojoDetails.id);
          this.usersDojos = response.body;
        }
      },
      redirectToSlug() {
        this.$router.replace({
          name: 'DojoDetails',
          params: {
            country: this._country,
            path: this._path.split('/'),
          },
        });
      },
      async volunteer(userType) {
        await service.requestUserInvite(this.user, this.dojoDetails.id, userType);
        /* eslint-disable no-alert */
        alert('The Champion of this Dojo has been notified that you want to volunteer.');
        /* eslint-enable no-alert */
      },
      buildDojoFrequency: DojoUtil.buildDojoFrequency,
    },
    async created() {
      this._country = this.country;
      if (this.path) {
        if (Array.isArray(this.path)) {
          this._path = this.path.join('/');
        } else {
          this._path = this.path;
        }
      }
      await Promise.all([
        this.loadDojoDetails(),
        this.loadCurrentUser(),
      ]);
      this.loadUserDojoRelationship();
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
      font-size: @font-size-h2;
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

    &__section {
      ~ .cd-dojo-details__section {
        margin-top: 64px;
      }
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
      font-size: @font-size-large;
      margin: 0 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;

      &-label {
        float: right;
        font-size: @font-size-small;
        font-weight: 900;
        color: white;
        background-color: @cd-purple;
        padding: 4px 8px;
      }
    }

    &__sub-heading {
      font-weight: bold;
      font-size: @font-size-medium;
      margin-bottom: 8px;
    }

    &__section-text {
      font-size: @font-size-medium;
    }

    &__volunteer-button {
      font-size: @font-size-medium;
      font-weight: bold;
      margin-top: 16px;
      margin-bottom: 32px;
      padding: 16px;
      color: @cd-blue;
      background-color: white;
      text-decoration: none;
      border: solid 1px @cd-blue;
      border-radius: 4px;

      &:hover {
        color: white;
        background-color: @cd-blue;
      }

      ~ .cd-dojo-details__volunteer-button {
        margin-bottom: 0;
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
        font-size: @font-size-large;
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
        font-size: @font-size-mobile-page-title;
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
