<template>
  <div>
    <div class="row">
      <div class="cd-dojo-details__banner col-sm-12">
          <div class="col-sm-1 headerContent">
            <img v-if="dojoDetails.id" v-img-fallback="{src: imageUrl, fallback: loadImage}"
                 class="img-circle cd-dojo-details__dojo-image"/>
          </div>
          <div class="col-sm-11 headerContent">
            <div class="cd-dojo-details__name align-middle">{{dojoDetails.name}}</div>
          </div>
        </div>
    </div>
    <div class="cd-dojo-details__container">
      <div class="cd-dojo-details__left_column">
        <div class="row cd-dojo-details__section">
          <div class="cd-dojo-details__time-label">
            <div class="fa fa-clock-o col-md-1" aria-hidden="true"></div>
            <div class="col-md-11 purple_label">TIME</div>
          </div>
          <div class="cd-dojo-details__time col-md-12">{{dojoDetails.time}}</div>
        </div>

        <div class="row cd-dojo-details__section">
          <div class="cd-dojo-details__address-label">
            <div class="fa fa-map-marker col-md-1" aria-hidden="true"></div>
            <div class="col-md-11 purple_label">LOCATION</div>
          </div>
          <div class="cd-dojo-details__address col-md-12">{{address}}</div>
        </div>

        <div class="row cd-dojo-details__section">
          <div class="cd-dojo-details__email-label">
            <div class="fa fa-envelope-o col-md-1" aria-hidden="true"></div>
            <div class="col-md-11 purple_label">EMAIL</div>
          </div>
          <div class="cd-dojo-details__email col-md-12">{{dojoDetails.email}}</div>
        </div>

        <div class="row cd-dojo-details__section">
          <div class="cd-dojo-details__website-label">
            <div class="fa fa-globe col-md-1" aria-hidden="true"></div>
            <div class="col-md-11 purple_label">WEBSITE</div>
          </div>
          <div class="cd-dojo-details__website col-md-12">{{dojoDetails.website}}</div>
        </div>

        <div class="row cd-dojo-details__social-media-section col-md-12">
            <a v-if="dojoDetails.facebook" class="fa fa-facebook-square cd-dojo-details__facebook sm-icon" :href="dojoDetails.facebook">&nbsp;</a>
            <a v-if="dojoDetails.twitter" class="fa fa-twitter-square cd-dojo-details__twitter sm-icon" aria-hidden="true" :href="dojoDetails.twitter"></a>
            <a v-if="dojoDetails.googleGroup" class="fa fa-google cd-dojo-details__google-group sm-icon" aria-hidden="true" :href="'mailto:' + dojoDetails.googleGroup"></a>
        </div>
      </div>

      <div class="cd-dojo-details__main_content">
        <events-list v-if="dojoDetails.id" v-bind:dojoId="dojoDetails.id"></events-list>
        <div class="cd-dojo-details__details-label details">DETAILS</div>
        <div class="cd-dojo-details__details" v-html="dojoDetails.notes"></div>
      </div>
    </div>

  </div>
</template>
<script>
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import service from './service';
  import eventsList from '../events/cd-event-list';

  /* eslint-disable global-require */
  export default {
    name: 'dojo-details',
    directives: {
      ImgFallback,
    },
    components: {
      'events-list': eventsList,
    },
    props: ['country', 'region', 'dojoName'],
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
        return `${this.country}/${this.region}/${this.dojoName}`;
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
    }

    &__banner {
      background-color: @cd-purple;
    }

    &__name {
      font-size: 30px;
      color: @cd-white;
    }

    &__left_column {
      background-color: #f4f5f6;
      max-width: 340px;
      font-size: 16px;
      flex: 4;
      margin: 0 -16px;
    }

    &__main_content {
      flex: 8;
      margin-left: 32px;
    }

    &__section {
      margin-top: 45px;
      margin-left: 14px;
      padding-right: 30px;

      .fa {
        font-size: 16px;
        color: @cd-purple;
        line-height: 1;
      }
    }

    &__social-media-section {
      margin-left: 14px;
      margin-top: 32px;

     .sm-icon {
        text-decoration: none;
        margin-right: 14px;
        font-size: 18px;
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
  }

  .headerContent{
    line-height: 3;
  }

  .details {
    font-size: 18px;
    color: @cd-purple;
  }

  .purple_label {
    width: 39px;
    height: 19px;
    font-size: 16px;
    font-weight: bold;
    color: @cd-purple;
    margin-left: -7px;
    line-height: 1;
  }



</style>
