<template>
  <div class="row">
    <div class="cd-dashboard-events">
      <div class="cd-dashboard-events__content">
        <h1 class="cd-dashboard-events__header">{{ $t('Hey {name}, here\'s what\'s most important...', { name: loggedInUser.firstName }) }}</h1>
        <div class="cd-dashboard-events__list" v-if="events && events[0].id">
          <upcoming-event v-for="event in events" :key="event.id" :event="event" :dojo="dojos[event.dojoId]"></upcoming-event>
        </div>
        <div v-else-if="ticketingAdmins.length > 0">
          {{ usesTicketing }} 
          {{ oldEvents }}
          <div v-if="!usesTicketing && maxDojoAge < 1" class="cd-dashboard-events__hint">{{ $t('Create your first event so attendees can book and you can easily see who\'s attending. It\'s simple and only takes 2 minutes!') }}</div>
          <div v-else-if="!usesTicketing && maxDojoAge >= 1" class="cd-dashboard-events__hint">{{ $t('We see you don\'t use Zen events. If you\'re using Eventbrite for your Dojo you can make it easier for attendees and volunteers to find you by using our one-click Eventbrite[link to EB plugin blogpost] plugin (it\'s really easy!)') }}</div>
          <div v-else-if="usesTicketing" class="cd-dashboard-events__hint">{{ $t('Create your next event so attendees can book in!') }}</div>
        </div>
        <div class="cd-dashboard-events__cta" v-if="events">
          <router-link class="cd-dashboard-events__cta-link" :to="{ name: 'MyTickets' }" v-ga-track-click="'your_events'">{{ $t('Your Events') }}</router-link>
        </div>
        <div v-else>
          <button></button>
          <button></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import DojosService from '@/dojos/service';
  import EventService from '@/events/service';
  import EventUtils from '@/events/util';
  import UpcomingEvent from './events/cd-dashboard-upcoming-event';

  export default {
    name: 'cd-dashboard-events',
    components: {
      UpcomingEvent,
    },
    data() {
      return {
        events: [{}, {}],
        oldEvents: null,
        usersDojos: [],
        dojos: {},
        loaded: false,
      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      usersDojosMap() {
        return this.usersDojos.reduce((map, usersDojo) => {
          const dojoId = usersDojo.dojoId;
          // eslint-disable-next-line no-param-reassign
          if (!map[dojoId]) map[dojoId] = [];
          map[dojoId].push(usersDojo);
          return map;
        }, {});
      },
      ticketingAdmins() {
        return this.usersDojos.filter(ud =>
          ud.userPermissions.includes('ticketing-admin'));
      },
      usesTicketing() {
        return this.oldEvents && this.oldEvents.length > 0;
      },
      maxDojoAge() {
        return Math.max(Object.values(this.dojos).map(d => moment().diff(d.createdAt, 'years')));
      },
    },
    methods: {
      async loadEvents() {
        const query = { status: 'published' };
        query.afterDate = moment().unix();
        query.utcOffset = moment().utcOffset();

        const events = await Promise.all(this.usersDojos.map(dojo =>
          EventService.v3.get(dojo.dojoId, {
            params: {
              query,
              related: 'sessions.tickets',
            },
          }),
        ));
        this.events = events
          .reduce((acc, dojoEvents) => acc.concat(dojoEvents.body.results), [])
          .sort(EventUtils.orderByStartTime)
          .slice(0, 2)
          .map(event => ({
            ...event,
            usersDojos: this.usersDojosMap[event.dojoId],
          }));
      },
      async loadOldEvents() {
        const query = { status: 'published' };
        query.afterDate = moment().subtract(1, 'year').unix();
        query.utcOffset = moment().utcOffset();

        this.oldEvents = (await Promise.all(this.ticketingAdmins.map(ud =>
          EventService.v3.get(ud.dojoId, {
            params: {
              query,
            },
          }),
        ))).reduce((acc, res) => acc.concat(res.body.results), []);
      },
      async loadUserDojos() {
        const res = await DojosService.getUsersDojos(this.loggedInUser.id);
        this.usersDojos = res.body;
      },
      async loadDojos() {
        const dojoIds = this.usersDojos.reduce((acc, event) => {
          if (acc.indexOf(event.dojoId) === -1) acc.push(event.dojoId);
          return acc;
        }, []);
        const res = await Promise.all(dojoIds.map(dojoId => DojosService.getDojoById(dojoId)));
        this.dojos = {};
        dojoIds.forEach((dojoId, index) => {
          this.dojos[dojoId] = res[index].body;
        });
      },
    },
    async created() {
      await this.loadUserDojos();
      await this.loadEvents();
      if (!this.events.length) {
        // Reset to default for the animation to continue running
        this.events = [{}, {}];
        this.loadOldEvents();
      }
      this.loadDojos();
      this.loaded = true;
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";
  @import "../common/styles/cd-filler-loading";

  .cd-dashboard-events {
    background-color: @cd-purple;
    padding: 48px 32px;
    justify-content: center;

    &__content {
      max-width: 824px;
      margin: 0 auto;
    }

    &__header {
      color: @cd-white;
      margin: 0 0 48px 0;
    }

    &__list-filler {
      background: @cd-very-light-grey;
      height: 90px;
      margin: 32px 0;
    }

    &__cta {
      text-align: center;

      &-link {
        display: inline-block;
        color: @cd-white;
        font-weight: bold;
        padding: 7px 14px;
        border: 1px solid @cd-white;
        border-radius: 2px;
      }
    }
  }
</style>
