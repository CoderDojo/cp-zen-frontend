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
      <info-column class="cd-dojo-details__left_column">
        <info-column-section icon="clock-o" :header="$t('Time')">
          {{ dojoDetails.time }}
        </info-column-section>
        <info-column-section icon="map-marker" :header="$t('Location')">
          {{ address }}
        </info-column-section>
        <info-column-section icon="envelope-o" :header="$t('Email')">
          <a :href="'mailto:' + dojoDetails.email">{{ dojoDetails.email }}</a>
        </info-column-section>
        <info-column-section icon="globe" :header="$t('Website')">
          {{ dojoDetails.website }}
        </info-column-section>
        <info-column-section class="cd-dojo-details__social-media">
          <a v-if="dojoDetails.facebook" class="cd-dojo-details__social-media-icon fa fa-2x fa-facebook-square cd-dojo-details__facebook" :href="dojoDetails.facebook"></a>
          <a v-if="dojoDetails.twitter" class="cd-dojo-details__social-media-icon fa fa-2x fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="dojoDetails.twitter"></a>
          <a v-if="dojoDetails.googleGroup" class="cd-dojo-details__social-media-icon fa fa-2x fa-google cd-dojo-details__google-group sm-icon" aria-hidden="true" :href="dojoDetails.googleGroup"></a>
        </info-column-section>
      </info-column>
      <div class="cd-dojo-details__main_content">
        <events-list v-if="dojoDetails.id" v-bind:dojoId="dojoDetails.id"></events-list>
        <div class="cd-dojo-details__details-label">{{ $t('Details') }}</div>
        <div class="cd-dojo-details__details" v-html="dojoDetails.notes"></div>
        <div v-if="dojoDetails.supporterImage" class="cd-dojo-details__sponsor_heading">
          {{ $t('Dojo supported by') }}
        </div>
        <div>
          <img v-if="dojoDetails.supporterImage" class="cd-dojo-details__sponsor_image" :src="dojoDetails.supporterImage"/>
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
  @import "~cd-common/common/_colors";

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

    &__left_column {
      max-width: 340px;
      flex: 4;
    }

    &__main_content {
      flex: 8;
      margin-left: 32px;
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

    &__details-label {
      color: #000;
      font-size: 18px;
      margin: 45px 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;
    }

    &__sponsor {
      &_heading {
        color: #000;
        font-size: 18px;
        margin: 45px 0 24px 0;
        font-weight: bold;
        border-bottom: 1px solid #bebebe;
        padding-bottom: 8px;
      }
      &_image {
        max-width: 360px;
        max-height: 360px;
      }
    }
  }

  .headerContent{
    line-height: 3;
  }
</style>
