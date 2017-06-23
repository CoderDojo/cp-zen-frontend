<template>
  <div v-if="eventDetails" class="cd-event-details">
    <div class="cd-event-details__left-column">
      <div class="cd-event-details__left-column-section">
        <div class="row">
          <div class="fa fa-clock-o cd-event-details__left-column-section-icon col-md-1"></div>
          <div class="cd-event-details__left-column-section-heading col-md-11">
            TIME
          </div>
        </div>
        <div class="row">
          <div v-if="!isRecurring()" class="cd-event-details__left-column-section-value col-md-12">
            {{ eventDetails.dates[0].startTime |  cdDateFormatter }}
          </div>
          <div v-else class="cd-event-details__left-column-section-value col-md-12">
            Next in series: <span class="cd-event-details__left-column-section-value-next-session">{{ getNextStartTime() |  cdDateFormatter }}</span>
          </div>
        </div>
        <div class="row">
          <div class="cd-event-details__left-column-section-value col-md-12">
            {{ eventDetails.dates[0].startTime | cdTimeFormatter }} - {{ eventDetails.dates[0].endTime | cdTimeFormatter }}
          </div>
        </div>
        <div v-if="isRecurring()" class="row cd-event-details__left-column-section-value-frequency">
          <div class="cd-event-details__left-column-section-value col-md-12">
            {{ buildRecurringFrequencyInfo() }}
          </div>
        </div>
      </div>
      <div class="cd-event-details__left-column-section">
        <div class="row">
          <div class="fa fa-map-marker cd-event-details__left-column-section-icon col-md-1"></div>
          <div class="cd-event-details__left-column-section-heading col-md-11">
            LOCATION
          </div>
        </div>
        <div class="row">
          <div class="cd-event-details__left-column-section-value col-md-12">
            {{ getFullAddress() }}
          </div>
        </div>
      </div>
    </div>
    <div class="cd-event-details__main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import service from './service';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
    data() {
      return {
        eventDetails: null,
        now: moment(),
      };
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    methods: {
      loadEvent() {
        service.loadEvent(this.eventId).then((response) => {
          this.eventDetails = response.body;
        });
      },
      getFullAddress() {
        return `${this.eventDetails.address}, ${this.eventDetails.city.nameWithHierarchy}, ${this.eventDetails.country.countryName}`;
      },
      isRecurring() {
        return this.eventDetails.type === 'recurring';
      },
      getNextStartTime() {
        const nextDateInfo = this.eventDetails.dates.find((dateInfo) => {
          const dateMoment = moment(dateInfo.startTime);
          return dateMoment.isAfter(this.now);
        }, this);
        return nextDateInfo.startTime;
      },
      buildRecurringFrequencyInfo() {
        let recurringTypeString = '';
        if (this.eventDetails.recurringType === 'biweekly') {
          recurringTypeString = 'Biweekly';
        } else if (this.eventDetails.recurringType === 'weekly') {
          recurringTypeString = 'Weekly';
        }
        const dayName = moment(this.eventDetails.dates[0].startTime).format('dddd');

        return `${recurringTypeString} on ${dayName}s`;
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
<style scoped lang="less">
  @import "~cd-common/common/_colors";

  .cd-event-details {
    display: flex;
    margin: 0 -16px;

    &__left-column {
      flex: 4;
      background-color: #f4f5f6;
      max-width: 340px;
      &-section {
        font-size: 16px;
        margin-top: 48px;
        margin-left: 30px;
        margin-right: 32px;

        &-icon {
         color: @cd-purple;
         height: 19px;
         margin-bottom: 4px;
        }
        &-heading {
         color: @cd-purple;
         font-weight: bold;
         height: 19px;
         margin-bottom: 4px;
         margin-left: -7px;
         line-height: 1;
        }
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
      padding: 0 16px;
    }
  }
</style>
