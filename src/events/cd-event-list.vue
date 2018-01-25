<template>
  <div class="cd-event-list">
    <div v-if="events.length === 0" class="cd-event-list__event">
      <div class="cd-event-list__no-events">
        <div class="cd-event-list__no-events-header">
          {{ $t('No Listed Events') }}
        </div>
        <div>
          <p class="cd-event-list__no-events-content" v-html="$t('This Dojo may list their events on another website or they may encourage people to attend without booking.')"></p>
          <p class="cd-event-list__no-events-content" v-html="$t(`${dojo.private ? 'Please email the Dojo on {email} to find out about their upcoming events.' : 'Please join this Dojo for updates and email the Dojo on {email} to find out about their upcoming events.' }`, { email: '<a href=\'mailto:' + dojo.email + '\'>' + dojo.email + '</a>' })"></p>
        </div>
        <button @click="joinTheDojo()" v-if="!dojo.private && !isDojoMember" class="cd-event-list__no-events-join-button" v-ga-track-click="'join_dojo_no_events'">{{ $t('Join Dojo') }}</button>
      </div>
    </div>
    <div v-else>
      <event-list-item v-for="event in events" :key="event.id" :event="event" :dojo="dojo" :users-dojos="usersDojos" :user="currentUser" class="cd-event-list__event"></event-list-item>
      <div v-if="!dojo.private && !isDojoMember" class="cd-event-list__event-join">
        <p class="cd-event-list__event-join-description">{{ $t('or') }}</p>
        <button v-ga-track-click="'join_dojo_has_events'" @click="joinTheDojo()" class="cd-event-list__event-join-button">{{ $t('Join the Dojo') }}</button>
        <p class="cd-event-list__event-join-description">{{ $t('to get notified of new events') }}</p>
      </div>
    </div>
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
    computed: {
      isDojoMember() {
        return this.currentUser && this.usersDojos.length > 0;
      },
    },
    methods: {
      async loadCurrentUser() {
        const res = await UserService.getCurrentUser();
        this.currentUser = res.body.user;
      },
      async loadUsersProfile() {
        const res = await UserService.userProfileData(this.currentUser.id);
        this.usersProfile = res.body;
      },
      async loadUserDojoRole() {
        const res = await DojosService.getUsersDojos(this.currentUser.id, this.dojo.id);
        this.usersDojos = res.body;
      },
      async loadEvents() {
        const res = await service.loadEvents(this.dojo.id);
        this.events = res.body;
      },
      async joinTheDojo() {
        if (this.currentUser) {
          const userType = UsersUtil.isYouthOverThirteen(new Date(this.usersProfile.dob)) ? 'attendee-o13' : 'parent-guardian';
          await DojosService.joinDojo(this.currentUser.id, this.dojo.id, [userType]);
          /* eslint-disable no-alert */
          alert('Congratulations, you have now joined the Dojo.');
          /* eslint-enable no-alert */
          this.loadUserDojoRole();
        } else {
          location.href = `/register/account?referer=${this.$route.path}`;
        }
      },
    },
    watch: {
      currentUser(newUser) {
        if (newUser) {
          this.loadUserDojoRole();
          this.loadUsersProfile();
        }
      },
    },
    created() {
      if (this.dojo.verified) {
        this.loadEvents();
      }
      this.loadCurrentUser();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";
  .join-button() {
    font-size: @font-size-medium;
    font-weight: bold;
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
  .text-description {
    font-size: 16px;
    color: #7b8082;
    margin-top: 8px;
  }

  .cd-event-list {
    &__event {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;
      &-join {
        text-align: center;
        &-button {
          padding: 12px;
          .join-button;
        }
        &-description {
          .text-description;
        }
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
        .text-description;
        text-align: left;
      }

      &-join-button {
        margin-top: 16px;
        padding: 8px;
        .join-button;
      }
    }
  }
</style>
