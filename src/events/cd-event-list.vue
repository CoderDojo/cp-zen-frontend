<template>
  <div class="cd-event-list">
    <div v-if="events.length === 0" class="cd-event-list__event">
      <div class="cd-event-list__no-events">
        <div class="cd-event-list__no-events-header">
          {{ $t('No Upcoming Events') }}
        </div>
        <p v-if="dojo.private" class="cd-event-list__no-events-content" v-html="$t('There are no upcoming events planned for this Dojo. Please email {email} if you have any questions.', { email: '<a href=\'mailto:' + dojo.email + '\'>' + dojo.email + '</a>' })"></p>
        <div v-else>
          <p class="cd-event-list__no-events-content" v-html="$t('There are no upcoming events planned for this Dojo. Please join this Dojo for updates or email {email}', { email: '<a href=\'mailto:' + dojo.email + '\'>' + dojo.email + '</a>' })"></p>
          <button @click="joinTheDojo()" v-if="currentUser" class="cd-event-list__no-events-join-button">{{ $t('Join Dojo') }}</button>
        </div>
      </div>
    </div>
    <event-list-item v-for="event in events" :key="event.id" :event="event" :dojo="dojo" :users-dojos="usersDojos" :user="currentUser" class="cd-event-list__event"></event-list-item>
  </div>
</template>
<script>
  import UserService from '@/users/service';
  import UsersUtil from '@/users/util';
  import DojosService from '@/dojos/service';
  import EventListItem from '@/events/cd-event-list-item';
  import service from './service';

  export default {
    name: 'event-list',
    props: ['dojo'],
    data() {
      return {
        currentUser: null,
        usersProfile: null,
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
      loadUsersProfile() {
        UserService.userProfileData()
          .then((response) => {
            this.usersProfile = response.body;
          });
      },
      loadEvents() {
        service.loadEvents(this.dojo.id).then((response) => {
          this.events = response.body;
        });
      },
      async joinTheDojo() {
        const userType = UsersUtil.isYouthOverThirteen(new Date(this.usersProfile.dob)) ? 'attendee-o13' : 'parent-guardian';
        await DojosService.joinDojo(this.currentUser.id, this.dojo.id, [userType]);
        /* eslint-disable no-alert */
        alert('Congratulations, you have now joined the Dojo.');
        /* eslint-enable no-alert */
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
      this.loadUsersProfile();
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
      &-join-button {
        font-size: @font-size-medium;
        font-weight: bold;
        margin-top: 16px;
        padding: 8px;
        color: @cd-blue;
        background-color: white;
        text-decoration: none;
        border: solid 1px @cd-blue;
        border-radius: 4px;

        &:hover {
          color: white;
          background-color: @cd-blue;
        }
      }
    }
  }
</style>
