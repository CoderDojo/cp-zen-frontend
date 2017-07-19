<template>
  <div>
    <div class="row">
      <div class="cd-dojo-details__banner col-sm-12">
          <div>
            <img v-if="dojoDetails.id" v-img-fallback="{src: imageUrl, fallback: loadImage}"
                 class="img-circle cd-dojo-details__dojo-image"/>
          </div>
          <div class="cd-dojo-details__name align-middle">{{ dojoDetails.name}}</div>
        </div>
    </div>
    <div class="cd-dojo-details__container">
      <info-column class="cd-dojo-details__left-column">
        <info-column-section class="cd-dojo-details__left-column-section" icon="clock-o" :header="$t('Time')">
          {{ dojoDetails.time }}
        </info-column-section>
        <info-column-section class="cd-dojo-details__left-column-section" icon="map-marker" :header="$t('Location')">
          {{ address }}
        </info-column-section>
        <info-column-section class="hidden-xs" icon="envelope-o" :header="$t('Email')">
          <a :href="'mailto:' + dojoDetails.email">{{ dojoDetails.email }}</a>
        </info-column-section>
        <info-column-section v-if="dojoDetails.website" class="hidden-xs" icon="globe" :header="$t('Website')">
          <a :href="formattedDojoWebsite" target="_blank">{{ dojoDetails.website }}</a>
        </info-column-section>
        <info-column-section class="cd-dojo-details__social-media hidden-xs">
          <a v-if="dojoDetails.facebook" class="cd-dojo-details__social-media-icon fa fa-2x fa-facebook-square cd-dojo-details__facebook" :href="dojoDetails.facebook"></a>
          <a v-if="dojoDetails.twitter" class="cd-dojo-details__social-media-icon fa fa-2x fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="dojoDetails.twitter"></a>
          <a v-if="dojoDetails.googleGroup" class="cd-dojo-details__social-media-icon fa fa-2x fa-google cd-dojo-details__google-group sm-icon" aria-hidden="true" :href="dojoDetails.googleGroup"></a>
        </info-column-section>
      </info-column>
      <div class="cd-dojo-details__main_content">
        <div class="cd-dojo-details__heading">{{ $t('Upcoming Events') }}</div>
        <events-list v-if="dojoDetails.id" v-bind:dojo="dojoDetails"></events-list>
        <div class="cd-dojo-details__heading">{{ $t('Details') }}</div>
        <div class="cd-dojo-details__details" v-html="dojoDetails.notes"></div>
        <div class="visible-xs">
          <div class="cd-dojo-details__heading">{{ $t('Contact Dojo') }}</div>
          <div class="cd-dojo-details__contact">
            <info-column-section icon="envelope-o" :header="$t('Email')">
              <a :href="'mailto:' + dojoDetails.email">{{ dojoDetails.email }}</a>
            </info-column-section>
            <info-column-section v-if="dojoDetails.website" icon="globe" :header="$t('Website')">
              <a :href="formattedDojoWebsite" target="_blank">{{ dojoDetails.website }}</a>
            </info-column-section>
            <info-column-section class="cd-dojo-details__social-media">
              <a v-if="dojoDetails.facebook" class="cd-dojo-details__social-media-icon fa fa-2x fa-facebook-square cd-dojo-details__facebook" :href="dojoDetails.facebook"></a>
              <a v-if="dojoDetails.twitter" class="cd-dojo-details__social-media-icon fa fa-2x fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="dojoDetails.twitter"></a>
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
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import InfoColumn from '@/common/cd-info-column';
  import InfoColumnSection from '@/common/cd-info-column-section';
  import service from './service';
  import eventsList from '../events/cd-event-list';

  /* eslint-disable global-require */
  export default {
    name: 'dojo-details',
    directives: {
      ImgFallback,
    },
    components: {
      eventsList,
      InfoColumn,
      InfoColumnSection,
    },
    props: ['country', 'path'],
    data() {
      return {
        dojoDetails: {},
      };
    },
    computed: {
      address() {
        return !this.dojoDetails.address1 ? undefined : `
          ${this.dojoDetails.address1},
          ${this.dojoDetails.placeName},
          ${this.dojoDetails.countryName}
        `;
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
      formattedDojoWebsite() {
        if (this.dojoDetails.website.substring(0, 7) === 'http://' || this.dojoDetails.website.substring(0, 8) === 'https://') {
          return this.dojoDetails.website;
        }
        return `http://${this.dojoDetails.website}`;
      },
    },
    methods: {
      loadDojoDetails() {
        service.getByUrlSlug(this.urlSlug).then((response) => {
          this.dojoDetails = response.body;
        }, () => {
        });
      },
    },
    created() {
      this.loadDojoDetails();
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
      flex: 8;
      margin: 0 32px 32px 16px;
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

    &__heading {
      color: #000;
      font-size: 18px;
      margin: 64px 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;

      &:first-child {
        margin-top: 45px;
      }
    }

    &__sponsor-image {
      > img {
        max-width: 360px;
        max-height: 360px;
      }
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
        margin: 0 16px;
      }
      &__sponsor-image {
        text-align: center;
        > img {
          width: 100%;
        }
      }
    }
  }
</style>
