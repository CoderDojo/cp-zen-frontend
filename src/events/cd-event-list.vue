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
    <event-list-item v-for="event in events" :key="event.id" :event="event" :dojo="dojo" :users-dojos="usersDojos" :user="currentUser" class="cd-event-list__event"></event-list-item>
  </div>
</template>
<script>
  import UserService from '@/users/service';
  import DojosService from '@/dojos/service';
  import EventListItem from '@/events/cd-event-list-item';
  import service from './service';

  export default {
    name: 'event-list',
    props: ['dojo'],
    data() {
      return {
        currentUser: null,
        usersDojos: [],
        events: [],
      };
    },
    components: {
      EventListItem,
    },
    methods: {
      loadCurrentUser() {
        UserService.getCurrentUser()
          .then((response) => {
            this.currentUser = response.body.user;
          });
      },
      loadEvents() {
        service.loadEvents(this.dojo.id).then((response) => {
          this.events = response.body;
        });
      },
    },
    watch: {
      currentUser(newUser) {
        if (newUser) {
          DojosService.getUsersDojos(newUser.id, this.dojo.id).then((response) => {
            this.usersDojos = response.body;
          });
        }
      },
    },
    created() {
      this.loadEvents();
      this.loadCurrentUser();
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
