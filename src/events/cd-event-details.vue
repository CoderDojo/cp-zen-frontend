<template>
  <div v-if="eventDetails" class="cd-event-details">
    <div class="row cd-event-details__header">
      <div class="col-md-12">
        <p class="cd-event-details__book-event-title">{{ $t('Book Event') }}</p>
        <p class="cd-event-details__event-title">{{ eventDetails.name }}</p>
      </div>
    </div>
    <div class="cd-event-details__container">
      <info-column class="cd-event-details__left-column">
        <info-column-section icon="clock-o" :header="$t('Time')">
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
        <info-column-section icon="map-marker" :header="$t('Location')">
          <div class="cd-event-details__left-column-section-value">
            {{ getFullAddress() }}
          </div>
        </info-column-section>
      </info-column>
      <div class="cd-event-details__main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import InfoColumn from '@/common/cd-info-column';
  import InfoColumnSection from '@/common/cd-info-column-section';
  import EventsUtil from '@/events/util';
  import service from './service';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
    data() {
      return {
        eventDetails: null,
      };
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    components: {
      InfoColumn,
      InfoColumnSection,
    },
    methods: {
      async loadEvent() {
        const response = await service.loadEvent(this.eventId);
        this.eventDetails = response.body;
      },
      getFullAddress() {
        return `${this.eventDetails.address}, ${this.eventDetails.city.nameWithHierarchy}, ${this.eventDetails.country.countryName}`;
      },
      buildRecurringFrequencyInfo: EventsUtil.buildRecurringFrequencyInfo,
      getNextStartTime: EventsUtil.getNextStartTime,
      isRecurring: EventsUtil.isRecurring,
    },
    created() {
      this.loadEvent();
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-event-details {

    &__header {
      background-color: @cd-purple;
      color: white;
      text-align: center;
      min-height: 108px;
      display: flex;
      align-items: center;
    }
    &__book-event-title {
      font-size: 30px;
      line-height: 30px;
      margin: 16px 0 8px 0;
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

      &-section {
        &-value {
          &-frequency {
            margin-top: 16px;
          }
          &-next-session {
            font-weight: bold;
          }
        }
      }
    }

    &__main-content {
      flex: 8;
      padding: 0 16px 32px 16px;
    }
  }
</style>
