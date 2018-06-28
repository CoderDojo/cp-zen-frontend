<template>
  <div class="cd-event-ticket-list">
    <h2 class="cd-event-ticket-list__header">{{ $t('Upcoming events') }}</h2>
    <div v-if="events.length === 0" class="cd-event-ticket-list__event">
      <div class="cd-event-ticket-list__no-events">
        <div class="cd-event-ticket-list__no-events-header">
          {{ $t('No Upcoming Events') }}
        </div>
        <p class="cd-event-ticket-list__no-events-content" v-html="$t('There are no upcoming events planned for your Dojos')">
        </p>
      </div>
    </div>
    <user-tickets v-for="event in events" :key="event.id" :event="event" users-dojos="usersDojos" :users="users" class="cd-event-ticket-list__event"></user-tickets>
  </div>
</template>
<script>
  import moment from 'moment';
  import UserService from '@/users/service';
  import DojosService from '@/dojos/service';
  import EventService from '@/events/service';
  import EventUtils from '@/events/util';
  import UserTickets from '@/events/cd-user-ticket-list-item';

  export default {
    name: 'event-ticket-list',
    props: [],
    data() {
      return {
        currentUser: null,
        usersDojos: [],
        events: [],
        users: {},
      };
    },
    components: {
      UserTickets,
    },
    methods: {
      async loadCurrentUser() {
        const res = await UserService.getCurrentUser();
        this.currentUser = res.body.user;
      },
      async loadEvents() {
        const query = { status: 'published' };
        query.afterDate = moment().unix();
        query.utcOffset = moment().utcOffset();

        return Promise.all(this.usersDojos.map((dojo) =>
          EventService.v3.get(dojo.dojoId, {
            params: {
              query,
              related: 'sessions.tickets',
            } })))
          .then((events) => {
              this.events = (events.reduce((red, dojoEvents) => {
                return red.concat(dojoEvents.body.results);
              }, []))
              .sort(EventUtils.orderByStartTime);
          });
      },
      async loadUserDojos() {
        const res = await DojosService.getUsersDojos(this.currentUser.id);
        this.usersDojos = res.body;
      },
      async loadUsersChildren() {
        const res = await UserService.getChildren(this.currentUser.id);
        this.users[this.currentUser.id] = this.currentUser;
        if (res.body && res.body.length > 0) {
          res.body.forEach((profile) => {
            this.users[profile.userId] = profile.user;
          });
        }
      },
    },
    async created() {
      await this.loadCurrentUser();
      await this.loadUsersChildren();
      await this.loadUserDojos();
      await this.loadEvents();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-event-ticket-list {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 32px;
    &__header {
      margin-top: 0px;
      padding-top: 20px;
    }

    &__event {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;
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
  }
</style>
