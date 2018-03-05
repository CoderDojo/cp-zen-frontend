<template>
  <div class="cd-event-list" >
    <div class="cd-event-list__heading" >{{ $t('Upcoming Events') }}</div>
    <div v-if="!hasFutureEvents" class="cd-event-list__event">
      <div class="cd-event-list__no-events">
        <div class="cd-event-list__no-events-header" v-if="!hasPastEvents">
          {{ $t('No Listed Events') }}
        </div>
        <div v-if="!hasFutureEvents && !hasPastEvents">
          <p class="cd-event-list__no-events-content" v-html="$t('This Dojo may list their events on another website or they may encourage people to attend without booking.')"></p>
          <p class="cd-event-list__no-events-content" v-html="$t(`${dojo.private ? 'Please email the Dojo on {email} to find out about their upcoming events.' : 'Please join this Dojo for updates and email the Dojo on {email} to find out about their upcoming events.' }`, { email: '<a href=\'mailto:' + dojo.email + '\'>' + dojo.email + '</a>' })"></p>
        </div>
        <div v-else>
          <p class="cd-event-list__no-events-content--had-events">{{ $t(noEventsContent) }}</p>
        </div>
        <button @click="joinTheDojo()" v-if="!dojo.private && !isDojoMember" class="cd-event-list__no-events-join-button" v-ga-track-click="'join_dojo_no_events'">{{ $t('Join Dojo') }}</button>
      </div>
    </div>
    <div class="cd-event-list__events">
      <event-list-item v-for="event in futureEvents" :key="event.id" :event="event" :dojo="dojo" :users-dojos="usersDojos" :user="currentUser" class="cd-event-list__event"></event-list-item>
      <div v-if="!hasFutureEvents">
        <div class="cd-event-list__heading" v-if="hasPastEvents">{{ $t('Past Events') }}</div>
        <event-list-item v-for="event in pastEvents" :key="event.id" :event="event" :dojo="dojo" :users-dojos="usersDojos" :user="currentUser" :past="true" class="cd-event-list__event"></event-list-item>
      </div>
    </div>
    <div v-if="!dojo.private && !isDojoMember && hasFutureEvents" class="cd-event-list__event-join">
      <p class="cd-event-list__event-join-description">{{ $t('or') }}</p>
      <button v-ga-track-click="'join_dojo_has_events'" @click="joinTheDojo()" class="cd-event-list__event-join-button">{{ $t('Join the Dojo') }}</button>
      <p class="cd-event-list__event-join-description">{{ $t('to get notified of new events') }}</p>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import UserService from '@/users/service';
  import UsersUtil from '@/users/util';
  import DojosService from '@/dojos/service';
  import EventListItem from '@/events/cd-event-list-item';
  import service from './service';


  export default {
    name: 'event-list',
    props: {
      dojo: {
        type: Object,
      },
    },
    data() {
      return {
        currentUser: null,
        usersProfile: null,
        usersDojos: [],
        futureEvents: null,
        pastEvents: null,
      };
    },
    components: {
      EventListItem,
    },
    computed: {
      noEventsContent() {
        const base = 'This Dojo had events recently!';
        const variant = this.isDojoMember ? 'You\'ll be notified when tickets for the next event are available.' : 'Join the Dojo to get notified when tickets for next event are available.';
        return `${base} ${variant}`;
      },
      isDojoMember() {
        return this.currentUser && this.usersDojos.length > 0;
      },
      hasFutureEvents() {
        return this.futureEvents && this.futureEvents.length > 0;
      },
      hasPastEvents() {
        return this.pastEvents && this.pastEvents.length > 0;
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
      async loadEvents(past = false) {
        const params = { status: 'published' };
        params.dateAfter = moment().format('x');
        if (past) {
          params.dateBefore = moment().format('x');
          params.dateAfter = moment().subtract(70, 'days').format('x');
        }
        return service.v3.get(
          this.dojo.id,
          { params },
        );
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
        this.loadEvents()
          .then((res) => { this.futureEvents = res.body; });
        this.loadEvents(true)
          .then((res) => { this.pastEvents = res.body; });
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
     &__heading {
      color: #000;
      font-size: @font-size-large;
      margin: 0 0 16px 0;
      font-weight: bold;
      border-bottom: 1px solid #bebebe;
      padding-bottom: 8px;
    }
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
        &--had-events {
          .text-description;
          text-align: center;
        }
      }

      &-join-button {
        margin-top: 16px;
        padding: 8px;
        .join-button;
      }
    }
  }
</style>
