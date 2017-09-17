<template>
  <div class="cd-user-ticket-list-item">
    <div class="cd-user-ticket-list-item__details">
      <header class="cd-user-ticket-list-item__header">
        <h3 class="cd-user-ticket-list-item__name">
          {{ event.name }}
        </h3>
      </header>
      <div class="cd-user-ticket-list-item__datetime">
        <div v-if="!isRecurring" class="cd-user-ticket-list-item__date-timestamp">
          {{ event.dates[0].startTime | cdDateFormatter }}
        </div>
        <div v-else>
          <div class="cd-user-ticket-list-item__date-series">{{ $t('Next in series:') }}</div>
          <span class="cd-user-ticket-list-item__date-timestamp">{{ nextStartTime |  cdDateFormatter }}</span>
        </div>
        <div class="cd-user-ticket-list-item__times-timestamp">
          {{ event.dates[0].startTime | cdTimeFormatter }} - {{ event.dates[0].endTime | cdTimeFormatter }}
        </div>
      </div>
    </div>
    <div v-if="!isPastEvent" class="cd-user-ticket-list-item__view-wrapper">
      <div v-if="event.eventbriteId">
        <a :href="event.eventbriteUrl | cdUrlFormatter" target="_blank" class="btn btn-lg btn-primary cd-user-ticket-list-item__view">{{ $t('See Details and Book') }}</a>
      </div>
      <div v-if="hasApplications" class="cd-user-ticket-list-item__view-applications">
        <h4 class="cd-user-ticket-list-item__view-application-title"><i class="fa fa-ticket"></i>{{ $t('Tickets') }}</h4>
        <div v-for="application in applications">
          <cd-attendee :application="application" :session="sessions[application.sessionId]" :ticket="tickets[application.ticketId]" :user="users[application.userId]"></cd-attendee>
        </div>
        <button tag="button"
          @click="cancel()"
          class="btn btn-lg cd-user-ticket-list-item__view-cancel-button">
          {{ $t('Cancel ticket', applications.length) }}</button>
      </div>
      <!-- NOTE : What about awaiting approval tickets ?-->
      <div v-else>
        <p>{{ $t('No ticket booked') }}</p>
        <router-link
          :to="bookLink"
          tag="button" class="btn btn-lg btn-primary cd-user-ticket-list-item__view">
          {{ $t('Book') }}</router-link>
      </div>
    </div>
    <div v-if="isRecurring" class="cd-user-ticket-list-item__recurring-info">
      <span class="fa fa-info-circle cd-user-ticket-list-item__recurring-info-icon"></span>
      <span class="cd-user-ticket-list-item__recurring-info-header">{{ $t('This is a recurring event') }}</span>
      <div class="cd-user-ticket-list-item__recurring-info-text">
        {{ $t('{recurringFrequencyInfo} at {formattedStartTime} - {formattedEndTime}, from {formattedFirstDate} to {formattedLastDate}',
        {recurringFrequencyInfo, formattedStartTime, formattedEndTime, formattedFirstDate, formattedLastDate}) }}
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import { sortBy, pick } from 'lodash';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import cdAttendee from './cd-attendee';
  import EventService from './service';
  import EventsUtil from './util';

  export default {
    name: 'user-ticket-list-item',
    props: ['event', 'dojo', 'usersDojos', 'users'],
    data() {
      return {
        applications: [],
        sessions: {},
        tickets: {},
      };
    },
    computed: {
      hasApplications() {
        return this.applications.length > 0;
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
      bookLink() {
        return `/dojo/${this.dojo.id}/event/${this.event.id}`;
      },
      formattedStartTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].startTime);
      },
      formattedEndTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].endTime);
      },
      formattedFirstDate() {
        const sortedDates = sortBy(this.event.dates, date => date.startTime);
        return this.$options.filters.cdDateFormatter(sortedDates[0].startTime);
      },
      formattedLastDate() {
        const sortedDates = sortBy(this.event.dates, date => date.startTime);
        return this.$options.filters.cdDateFormatter(sortedDates[sortedDates.length - 1].startTime);
      },
    },
    methods: {
      prepareSessions() {
        this.event.sessions.forEach((s) => {
          this.sessions[s.id] = s;
        });
      },
      prepareTickets() {
        this.event.sessions.forEach((s) => {
          s.tickets.forEach((t) => {
            this.tickets[t.id] = t;
          }, this);
        });
      },
      async cancel() {
        const payload = [];
        const commonFields = ['dojoId', 'eventId', 'sessionId', 'ticketName',
          'ticketType', 'ticketId', 'userId', 'notes', 'deleted'];
        this.applications.forEach((application) => {
          application.deleted = true; // eslint-disable-line no-param-reassign
          payload.push(pick(application, commonFields));
        });
        await EventService.manageTickets(payload);
        this.applications = [];
        alert(this.$t('Applications cancelled')); // eslint-disable-line no-alert
      },
      async loadUsersApplications() {
        const res = await EventService.loadApplications(this.event.id);
        if (res.body && res.body.length > 0) {
          this.applications = res.body;
        }
      },
    },
    components: {
      cdAttendee,
    },
    async created() {
      this.prepareSessions();
      this.prepareTickets();
      this.loadUsersApplications();
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

  .cd-user-ticket-list-item {
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

    &__view-application {
      font-size: @font-size-large;
    }

    &__view-application-title {
      color: @light-grey;
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
      background-color: #f4f5f6;
      color: #7b8082;
      margin: 32px -16px -16px -16px;
      padding: 16px;
      &-icon {
        font-size: 16px;
        margin-right: 4px;
      }
      &-header {
        font-weight: bold;
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
      &-cancel-button {
        font-size: @font-size-medium;
        font-weight: bold;
        margin-top: 16px;
        padding: 8px;
        color: @cd-blue;
        background-color: white;
        text-decoration: none;
        border: solid 1px @cd-blue;
        border-radius: 4px;
        display: block;
        &:hover {
          color: white;
          background-color: @cd-blue;
        }
      }

    }

    &__datetime {
      margin-right: 27px;
      flex: 1;
    }
  }
  @media (max-width: @screen-xs-max) {
    .cd-user-ticket-list-item {
      &__details {
        flex-direction: column;
      }
      &__name {
        font-size: 18px;
        font-weight: bold;
      }
      &__view-applications {
        font-size: @font-size-base;
      }
      &__view-wrapper {
        text-align: center;
      }
      &__recurring-info {
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
