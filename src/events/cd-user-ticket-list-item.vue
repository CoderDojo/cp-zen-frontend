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
          {{ formattedStartTime }} - {{ formattedEndTime }}
        </div>
      </div>
    </div>
    <div v-if="!isPastEvent" class="cd-user-ticket-list-item__view-wrapper">
      <div v-if="event.eventbriteId">
        <a :href="event.eventbriteUrl | cdUrlFormatter" target="_blank" class="btn btn-lg btn-primary cd-user-ticket-list-item__view">{{ $t('See Details and Book') }}</a>
      </div>
      <div v-if="hasApplications" class="cd-user-ticket-list-item__view-applications">
        <h4 class="cd-user-ticket-list-item__view-application-title"><i class="fa fa-ticket"></i>{{ $t('Tickets') }}</h4>
        <div class="cd-user-ticket-list-item__view-applications-order">
          <div class="cd-user-ticket-list-item__view-applications-order-applicants">
            <div v-for="application in applications" :key="application.id">
              <cd-attendee :application="application" :session="sessions[application.sessionId]" :ticket="ticketsById[application.ticketId]" :user="users[application.userId]"></cd-attendee>
            </div>
            <span v-if="applications && applications[0].orderId">
              <router-link
                tag="button" class="btn btn-lg btn-primary cd-user-ticket-list-item__view cd-user-ticket-list-item__view-mod-booking"
                :to="{ name: 'EventSessions', params: { eventId: event.id } }">{{ $t('Modify booking') }}</router-link>
            </span>
            <button
              @click="cancel()"
              class="btn btn-lg cd-user-ticket-list-item__view-cancel">
              {{ $t('Cancel ticket', applications.length) }}</button>
          </div>
          <div class="cd-user-ticket-list-item__view-applications-order-qrcode">
            <img v-if="applications && applications[0].orderId" :src="qrCodeUrl(applications[0].orderId)" alt="qrcode-checkin"/>
            <small> {{ $t('Get this image scanned by your champion to be checked-in!') }} </small>
          </div>
        </div>
      </div>
      <!-- NOTE : What about awaiting approval tickets ?-->
      <div v-if="!hasApplications && !event.eventbriteId">
        <p>{{ $t('No ticket booked') }}</p>
        <router-link
           :to="{ name: 'EventSessions', params: { eventId: event.id } }"
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
  import Vue from 'vue';
  import { pick } from 'lodash';
  import cdAttendee from './cd-attendee';
  import EventTile from './cd-event-tile';
  import EventService from './service';

  const cancelFields = ['dojoId', 'eventId', 'sessionId', 'ticketName',
    'ticketType', 'ticketId', 'userId', 'notes', 'deleted'];

  export default {
    name: 'user-ticket-list-item',
    mixins: [EventTile],
    props: ['event', 'usersDojos', 'users'],
    data() {
      return {
        applications: [],
        sessions: {},
        ticketsById: {},
      };
    },
    computed: {
      hasApplications() {
        return this.applications.length > 0;
      },
    },
    methods: {
      qrCodeUrl(orderId) {
        return `${Vue.config.s3Server}/zenbookingqrcode/${orderId}.png`;
      },
      prepareSessions() {
        this.event.sessions.forEach((s) => {
          this.sessions[s.id] = s;
        });
      },
      prepareTickets() {
        this.tickets.forEach((t) => {
          this.ticketsById[t.id] = t;
        }, this);
      },
      async cancel() {
        const payload = [];
        this.applications.forEach((application) => {
          application.deleted = true; // eslint-disable-line no-param-reassign
          payload.push(pick(application, cancelFields));
        });
        await EventService.manageTickets(payload);
        this.applications = [];
        alert(this.$t('Your applications have been successfully cancelled.')); // eslint-disable-line no-alert
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
  };
</script>
<style scoped lang="less">
    @import "../common/styles/cd-event-tile";

  .cd-user-ticket-list-item {
    .cd-event-tile;

    &__view{
      &-application {
        font-size: @font-size-large;
        &s-order {
          display: flex;
          flex-wrap: wrap;
          &-applicants {
            flex: 3.5;
          }
          &-qrcode {
            flex: 1;
            display: flex;
            flex-direction: column;
            & img {
              max-width: 150px;
              min-width: 150px;
            }
            & small {
              text-align: center;
              max-width: 150px;
            }
          }
        }
      }
    }

    &__view-application-title {
      color: @light-grey;
    }

    &__view {
      &-cancel-button {
        font-size: @font-size-medium;
        font-weight: bold;
        &-title {
          color: @light-grey;
        }
      }
      &-cancel {
        margin-top: 16px;
        color: @cd-blue;
        background-color: white;
        text-decoration: none;
        border: solid 1px @cd-blue;
        border-radius: 4px;
        display: inline-block;
        vertical-align: bottom;
        &:hover {
          color: white;
          background-color: @cd-blue;
        }
      }
      &-mod-booking {
        margin-right: 12px;
      }
    }
  }
  @media (max-width: @screen-xs-max) {
    .cd-user-ticket-list-item {
      &__view-applications {
        font-size: @font-size-base;
        &-order-qrcode {
          flex-basis: 200px;
          align-items: center;
        }
      }
    }
  }
</style>
