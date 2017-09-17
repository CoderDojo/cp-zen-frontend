<template>
  <div class="cd-event-list">
    <h3>{{ $t('Upcoming events') }}</h3>
    <div v-if="events.length === 0" class="cd-event-list__event">
      <div class="cd-event-list__no-events">
        <div class="cd-event-list__no-events-header">
          {{ $t('No Upcoming Events') }}
        </div>
        <p class="cd-event-list__no-events-content" v-html="$t('There are no upcoming events planned for your Dojos')">
        </p>
      </div>
    </div>
    <user-tickets v-for="event in events" :key="event.id" :event="event" :dojo="event.dojo" :users-dojos="usersDojos" :users="users" class="cd-event-list__event"></user-tickets>
  </div>
</template>
<script>
  import UserService from '@/users/service';
  import DojosService from '@/dojos/service';
  import EventService from '@/events/service';
  import UserTickets from '@/events/cd-user-ticket-list-item';

  export default {
    name: 'event-list',
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
        this.usersDojos.forEach(async (dojo) => {
          const res = await EventService.loadEvents(dojo.dojoId);
          const events = res.body;
          events.forEach((event) => { event.dojo = dojo; }); // eslint-disable-line no-param-reassign
          this.events = this.events.concat(events);
        }, this);
      },
      async loadUserDojos() {
        const res = await DojosService.getUsersDojos(this.currentUser.id);
        this.usersDojos = res.body;
      },
      async loadUsersChildren() {
        const res = await UserService.getChildren(this.currentUser.id);
        this.users[this.currentUser.id] = this.currentUser;
        if (res.body && res.body.length > 0) {
          res.body.forEach((user) => {
            this.users[user.userId] = user;
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

  .cd-event-list {
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