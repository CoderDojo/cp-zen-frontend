<template>
  <div v-if="eventDetails" class="cd-event-details">
    <div class="row cd-event-details__header">
      <p class="cd-event-details__book-event-title">{{ $t('Book Event') }}</p>
      <p class="cd-event-details__event-title">{{ eventDetails.name }}</p>
    </div>
    <div class="cd-event-details__container">
      <info-column class="cd-event-details__left-column">
        <info-column-section class="cd-event-details__left-column--dojo">
          <div class="cd-event-details__left-column-section-value-dojo hidden-xs">
            {{ $t('Event hosted by') }}
            <div v-if="dojo && dojo.id">
              <img v-img-fallback="{src: dojoImage, fallback: dojoFallbackImage}" class="img-circle cd-event-details__left-column-section-value-dojo-image"/>
              <router-link :to="getDojoUrl(dojo)">{{ dojo.name }}</router-link>
            </div>
          </div>
        </info-column-section>
        <info-column-section icon="clock-o" :header="$t('Time')" class="cd-event-details__left-column--time" >
          <div v-if="!isRecurring(eventDetails)" class="cd-event-details__left-column-section-value">
            {{ eventDetails.dates[0].startTime |  cdDateFormatter }}
          </div>
          <div v-else class="cd-event-details__left-column-section-value">
            {{ $t('Next in series:') }} <span class="cd-event-details__left-column-section-value-next-session">{{ getNextStartTime(eventDetails) |  cdDateFormatter }}</span>
          </div>
          <div class="cd-event-details__left-column-section-value">
            {{ eventDetails.dates[0].startTime | cdTimeFormatter }} - {{ eventDetails.dates[0].endTime | cdTimeFormatter }}
          </div>
          <div v-if="isRecurring(eventDetails)" class="cd-event-details__left-column-section-value-frequency">
            <div class="cd-event-details__left-column-section-value">
              {{ buildRecurringFrequencyInfo(eventDetails) }}
            </div>
          </div>
        </info-column-section>
        <info-column-section class="cd-event-details__left-column-section" icon="map-marker" :header="$t('Location')">
          <div class="cd-event-details__left-column-section-value">
            {{ fullAddress }}
          </div>
        </info-column-section>
        <info-column-section class="cd-event-details__left-column-section hidden-xs" icon="list" :header="$t('Event details')">
          <div class="cd-event-details__left-column-section-value">
            <cd-expandable>
              <div v-html="description"></div>
            </cd-expandable>
          </div>
        </info-column-section>
      </info-column>
      <div class="cd-event-details__main-content">
        <router-view></router-view>
        <div class="visible-xs">
          <div class="cd-event-details__heading">{{ $t('Event details') }}</div>
          <div class="cd-event-details__left-column-section-value">
            <cd-expandable>
              <div v-html="description"></div>
            </cd-expandable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdHTMLFilter from '@/common/filters/cd-html-filter';
  import cdExpandable from '@/common/cd-expandable';
  import InfoColumn from '@/common/cd-info-column';
  import InfoColumnSection from '@/common/cd-info-column-section';
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import EventsUtil from '@/events/util';
  import DojoUtils from '@/dojos/util';
  import store from '@/store';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
    store,
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    directives: {
      ImgFallback,
    },
    components: {
      InfoColumn,
      InfoColumnSection,
      cdExpandable,
    },
    methods: {
      buildRecurringFrequencyInfo: EventsUtil.buildRecurringFrequencyInfo,
      getNextStartTime: EventsUtil.getNextStartTime,
      isRecurring: EventsUtil.isRecurring,
      getDojoUrl: DojoUtils.getDojoUrl,
    },
    computed: {
      ...mapGetters('order', {
        eventDetails: 'event',
      }),
      ...mapGetters(['dojo']),
      fullAddress() {
        return `${this.eventDetails.address}, ${this.eventDetails.city.nameWithHierarchy}, ${this.eventDetails.country.countryName}`;
      },
      description() {
        return cdHTMLFilter(this.eventDetails.description);
      },
      dojoImage() {
        return DojoUtils.imageUrl(this.eventDetails.dojoId);
      },
      dojoFallbackImage: {
        get: DojoUtils.fallbackImage,
      },
    },
  };
</script>
<style scoped lang="less">
  @import "../../common/variables";
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-event-details {

    &__header {
      background-color: @cd-purple;
      color: white;
      text-align: center;
      min-height: 108px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    &__book-event-title {
      font-size: 30px;
      line-height: 30px;
      margin: 16px 0 8px 0;
      font-weight: bold;
    }
    &__event-title {
      font-size: 18px;
      line-height: 18px;
      margin: 8px 0 16px 0;
      font-weight: bold;
    }
    &__container {
       display: flex;
       margin: 0 -16px;
    }

    &__left-column {
      flex: 4;
      max-width: 340px;

      &--dojo {
        margin: 24px 0;
      }
      &--time {
        margin: 24px 0 48px 0;
      }
      &-section {
        &-value {
          &-frequency {
            margin-top: 16px;
          }
          &-next-session {
            font-weight: bold;
          }
          &-dojo {
            padding-bottom: 24px;
            border-bottom: 1px solid @cd-grey;
            &-image {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }

    &__main-content {
      flex: 8;
      padding: 0 16px 32px 16px;
    }
    &__heading {
      font-size: 24px;
      margin: 45px 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-event-details {
      &__container {
        flex-direction: column;
      }

      &__left-column {
        text-align: center;
        max-width: none;

        &--time, &-section  {
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      }
      &__main_content {
        padding: 45px 16px 0 16px;
      }
    }
  }
</style>
