<template>
  <div class="cd-event-list-item" v-if="isEventShown">
    <div class="cd-event-list-item__event-details">
      <header class="cd-event-list-item__event-header">
        <h3 class="cd-event-list-item__event-name">
          {{ event.name }}
        </h3>
        <h4 class="cd-event-list-item__event-sessions">
          <strong>{{ $t('Sessions') }}:</strong> {{ getSessionListForEvent }}
        </h4>
      </header>
      <div class="cd-event-list-item__datetime">
        <div v-for="date in event.dates">
          <div class="cd-event-list-item__event-date-timestamp">
            {{ date.startTime | cdDateFormatter }}
          </div>
          <div class="cd-event-list-item__event-times-timestamp">
            {{ date.startTime | cdTimeFormatter }} - {{ date.endTime | cdTimeFormatter }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="canBook" class="cd-event-list-item__event-view-wrapper">
      <div v-if="event.eventbriteId">
        <a :href="event.eventbriteUrl | cdUrlFormatter" target="_blank" class="btn btn-lg btn-primary cd-event-list-item__event-view">{{ $t('See Details and Book') }}</a>
      </div>
      <router-link :to="{name: 'EventDobVerification', params: {eventId: event.id}}"
                   :disabled="isEventFull" v-else
                   tag="button" class="btn btn-lg btn-primary cd-event-list-item__event-view">
        {{ isEventFull ? $t('Full') : $t('See Details and Book') }}
      </router-link>
    </div>
  </div>
</template>
<script>
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';

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
      isEventShown() {
        if (!this.isMember) {
          return this.event.public;
        }
        return true;
      },
      isEventFull() {
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
    &__event {
      &-details {
        display: flex;
      }

      &-header {
        flex: 3;
      }

      &-name {
        font-size: 24px;
        margin: 0;
      }

      &-sessions {
        font-size: 16px;
        color: #7b8082;
        margin: 8px 0;
      }

      &-date, &-times {
       flex: 1;
        &-timestamp {
          list-style-type: none;
          padding: 0;
          font-size: 18px;
        }
      }

      &-date-timestamp {
        font-size: 18px;
       }

      &-times-timestamp {
         font-size: 16px;
       }

     &-view {
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
   }
    &__datetime {
      margin-right: 27px;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-event-list-item {
      &__event {
        &-details {
          flex-direction: column;
        }
        &-name {
          font-size: 18px;
          font-weight: bold;
        }
        &-sessions {
          font-size: 14px;
        }
        &-view-wrapper {
          text-align: center;
        }
      }
      &__datetime {
        margin-right: 0;
        margin-top: 16px;
        text-align: center;
      }
    }
  }
</style>
