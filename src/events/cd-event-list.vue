<template>
  <div class="cd-event-list">
    <div v-if="events.length === 0" class="cd-event-list__event">
      <div class="cd-event-list__no-events">
        <div class="cd-event-list__no-events-header">
          {{ $t('No Upcoming Events') }}
        </div>
        <p class="cd-event-list__no-events-content" v-html="$t('There are no upcoming events planned for this Dojo. Please email {email} if you have any questions.', { email: '<a href=\'mailto:' + dojo.email + '\'>' + dojo.email + '</a>' })">
        </p>
      </div>
    </div>
    <div v-for="event in events" class="cd-event-list__event">
      <div class="cd-event-list__event-details">
        <header class="cd-event-list__event-header">
          <h3 class="cd-event-list__event-name">
            {{ event.name }}
          </h3>
          <h4 class="cd-event-list__event-sessions">
            <strong>{{ $t('Sessions') }}:</strong> {{ getSessionListForEvent(event) }}
          </h4>
        </header>
        <div class="cd-event-list__datetime">
          <div v-for="date in event.dates">
            <div class="cd-event-list__event-date-timestamp">
              {{ date.startTime | cdDateFormatter }}
            </div>
            <div class="cd-event-list__event-times-timestamp">
              {{ date.startTime | cdTimeFormatter }} - {{ date.endTime | cdTimeFormatter }}
            </div>
          </div>
        </div>
      </div>
      <div class="cd-event-list__event-view-wrapper">
        <router-link :to="{name: 'EventDobVerification', params: {eventId: event.id}}"
                     tag="button" class="btn btn-lg btn-primary cd-event-list__event-view">
          {{ $t('See Details and Book') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import service from './service';

  export default {
    name: 'event-list',
    props: ['dojo'],
    data() {
      return {
        events: [],
      };
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    methods: {
      loadEvents() {
        service.loadEvents(this.dojo.id).then((response) => {
          this.events = response.body;
        });
      },
      getSessionListForEvent(event) {
        return event.sessions.map(session => session.name).join(', ');
      },
    },
    created() {
      this.loadEvents();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-event-list {
    &__event {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;

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
      }
    }

    &__no-events {
      padding: 16px;
      text-align: center;
      &-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      &-content {
        font-size: 16px;
        color: #7b8082;
        margin-top: 8px;
      }
    }

    &__datetime {
      margin-right: 27px;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-event-list {
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
