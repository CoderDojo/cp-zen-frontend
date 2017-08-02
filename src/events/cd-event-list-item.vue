<template>
  <div class="cd-event-list-item" v-if="isVisible">
    <div class="cd-event-list-item__details">
      <header class="cd-event-list-item__header">
        <h3 class="cd-event-list-item__name">
          {{ event.name }}
        </h3>
        <h4 class="cd-event-list-item__sessions">
          <strong>{{ $t('Sessions') }}:</strong> {{ getSessionListForEvent }}
        </h4>
      </header>
      <div class="cd-event-list-item__datetime">
        <div v-if="!isRecurring" class="cd-event-list-item__date-timestamp">
          {{ event.dates[0].startTime | cdDateFormatter }}
        </div>
        <div v-else>
          <div class="cd-event-list-item__date-series">{{ $t('Next in series:') }}</div>
          <span class="cd-event-list-item__date-timestamp">{{ nextStartTime |  cdDateFormatter }}</span>
        </div>
        <div class="cd-event-list-item__times-timestamp">
          {{ event.dates[0].startTime | cdTimeFormatter }} - {{ event.dates[0].endTime | cdTimeFormatter }}
        </div>
        <div v-if="isRecurring" class="cd-event-list-item__recurring-info">
          <span class="fa fa-info-circle cd-event-list-item__recurring-info-icon"></span>
          <span class="cd-event-list-item__recurring-info-text">{{ `${recurringFrequencyInfo} ${$t('at')}` }} {{ event.dates[0].startTime | cdTimeFormatter }} - {{ event.dates[0].endTime | cdTimeFormatter }}</span>
        </div>
      </div>
    </div>
    <div v-if="canBook && !isPastEvent" class="cd-event-list-item__view-wrapper">
      <div v-if="event.eventbriteId">
        <a :href="event.eventbriteUrl | cdUrlFormatter" target="_blank" class="btn btn-lg btn-primary cd-event-list-item__view">{{ $t('See Details and Book') }}</a>
      </div>
      <router-link :to="{name: 'EventDobVerification', params: {eventId: event.id}}"
                   :disabled="isFull" v-else
                   tag="button" class="btn btn-lg btn-primary cd-event-list-item__view">
        {{ isFull ? $t('Full') : $t('See Details and Book') }}
      </router-link>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import EventsUtil from './util';

  export default {
    name: 'event-list-item',
    props: ['event', 'dojo', 'usersDojos', 'user'],
    computed: {
      isMember() {
        return !!(this.usersDojos.length);
      },
      canBook() {
        return (!!this.user && this.isMember) || this.dojo.private === 0;
      },
      isVisible() {
        if (!this.isMember) {
          return this.event.public;
        }
        return true;
      },
      isFull() {
        let totalEventCapacity = 0;
        let totalTicketsBooked = 0;
        this.event.sessions.forEach((session) => {
          session.tickets.forEach((ticket) => {
            totalEventCapacity += ticket.quantity;
            totalTicketsBooked += ticket.approvedApplications;
          });
        });
        return totalEventCapacity === totalTicketsBooked;
      },
      getSessionListForEvent() {
        return this.event.sessions.map(session => session.name).join(', ');
      },
      nextStartTime() {
        return EventsUtil.getNextStartTime(this.event);
      },
      isRecurring() {
        return EventsUtil.isRecurring(this.event);
      },
      recurringFrequencyInfo() {
        return EventsUtil.buildRecurringFrequencyInfo(this.event);
      },
      isPastEvent() {
        const now = moment();
        const eventStartTime = moment(this.event.dates[this.event.dates.length - 1].startTime);
        eventStartTime.subtract(eventStartTime.utcOffset(), 'minutes');
        return now.isAfter(eventStartTime);
      },
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
      cdUrlFormatter,
    },
  };
</script>
<style scoped lang="less">
    @import "../common/variables";

  .cd-event-list-item {
    &__details {
      display: flex;
    }

    &__header {
      flex: 4;
    }

    &__name {
      font-size: 24px;
      margin: 0;
    }

    &__sessions {
      font-size: 16px;
      color: #7b8082;
      margin: 8px 0;
    }

    &__date, &__times {
      flex: 1;
      &-timestamp {
        list-style-type: none;
        padding: 0;
        font-size: 18px;
      }
    }

    &__date {
      &-timestamp {
        font-size: 18px;
      }

      &-series {
        font-size: 14px;
        color: #7b8082;
      }
    }

    &__times-timestamp {
      font-size: 16px;
    }

    &__recurring-info {
      color: #7b8082;
      margin-top: 16px;
      &-icon {
        font-size: 16px;
      }
      &-text {
        font-size: 14px;
      }
    }

    &__view {
      margin-top: 32px;
      &:disabled {
         background-color: #bdc3c6;
         color: white;
         font-weight: bold;
         width: 220px;
         text-transform: uppercase;
         border-color: transparent;
      }
    }

    &__datetime {
      margin-right: 27px;
      flex: 1;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-event-list-item {
      &__details {
        flex-direction: column;
      }
      &__name {
        font-size: 18px;
        font-weight: bold;
      }
      &__sessions {
        font-size: 14px;
      }
      &__view-wrapper {
        text-align: center;
      }
      &__recurring-info {
        padding: 0 24px;
        width: auto;
      }
      &__datetime {
        margin-right: 0;
        margin-top: 16px;
        text-align: center;
      }
    }
  }
</style>
