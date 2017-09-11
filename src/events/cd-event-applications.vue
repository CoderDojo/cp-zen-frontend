<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">{{ $t('Select Event Tickets') }}</h1>
    <div class="cd-event-sessions__session" v-for="session in sessions">
      <h3 class="cd-event-sessions__name">{{ session.name }}</h3>
      <p class="cd-event-sessions__description">{{ session.description }}</p>
      <event-application-item :session="session" :event-id="eventId" :users="users"></event-application-item>
    </div>

    <router-link :to="{name: 'EventBookingForm', params: {eventId}}"
                 class="cd-event-sessions__next btn btn-primary"
                 tag="button">{{ $t('Proceed') }}
    </router-link>
  </div>
</template>
<script>
  import { findIndex, isArray } from 'lodash';
  import UserService from '@/users/service';
  import EventService from '@/events/service';
  import EventApplicationItem from './cd-event-application-item';

  export default {
    name: 'applications',
    props: ['eventId'],
    components: {
      EventApplicationItem,
    },
    data() {
      return {
        sessions: [],
        currentUser: {},
        users: [],
        event: null,
        applications: [],
      };
    },
    methods: {
      async loadSessions() {
        const res = await EventService.loadSessions(this.eventId);
        this.sessions = res.body;
        this.event.sessions = this.sessions;
      },
      // TODO : share info (store ?) with /UserTickets
      async loadEvent() {
        const res = await EventService.loadEvent(this.eventId);
        this.event = res.body;
      },
      async loadUsersApplications() {
        const res = await EventService.loadApplications(
          this.event.id,
          { in$: this.users.map(o => o.userId) });
        if (res.body && res.body.length > 0) {
          this.applications = res.body;
        }
      },
      async loadUsersChildren() {
        const res = await UserService.getChildren(this.currentUser.id);
        // TODO : unify user/profile
        this.users.push(this.currentUser);
        if (res.body && res.body.length > 0) {
          res.body.forEach((user) => {
            this.users.push(user);
          });
        }
      },
      async loadCurrentUser() {
        const res = await UserService.getCurrentUser();
        this.currentUser = res.body.user;
      },
    },
    async created() {
      this.loadEvent();
      this.loadSessions();
      await this.loadCurrentUser();
      await this.loadUsersChildren();
      await this.loadUsersApplications();
    },
    watch: {
      applications: () => {
        this.applications.forEach((application) => {
          const sessionIndex = findIndex(this.sessions, { id: application.sessionId });
          const ticketIndex = findIndex(this.sessions[sessionIndex].tickets,
            { id: application.ticketId });
          let tickets = this.sessions[sessionIndex][ticketIndex];
          if (!isArray()) tickets = [];
          tickets.push(application);
          console.log('pushed', application);
        });
      },
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-event-sessions {
    &__header {
      font-size: 24px;
      margin: 45px 0 16px 0;
    }
    &__name {
      color: @cd-purple;
      margin: 0;
      font-size: 18px;
    }
    &__description {
      margin: 4px 0;
    }
    &__session {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;
    }

    &__next {
       margin: 34px 0 16px 0;
    }
  }
</style>
