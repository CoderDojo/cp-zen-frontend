<template>
  <div class="row">
    <div class="cd-dashboard-events">
      <div class="cd-dashboard-events__content">
         <dashboard-header :has-dojos="hasDojos" :has-requests="hasRequests" :first-name="loggedInUser.firstName" :user-id="loggedInUser.id"></dashboard-header>
         <div class="cd-dashboard-events__list" v-if="events.length > 0">
          <upcoming-event v-for="event in events" :key="event.id" :event="event" :dojo="dojos[event.dojoId]"></upcoming-event>
        </div>
        <div v-if="hasDojos && ticketingAdmins.length > 0 && events.length <= 0">
          <dashboard-create-event :dojos="dojos" :old-events="oldEvents" :ticketing-admins="ticketingAdmins" > </dashboard-create-event>
        </div>
        <div v-if="usersDojos && dojoAdmins.length === 1 && hasDojos && dojoAge(firstDojo, 'weeks') < 2">
          <dashboard-admin-survey :dojo-name="firstDojo.name"></dashboard-admin-survey>
        </div>
        <div v-if="hasRequests">
          <dashboard-pending-volunteering :requests-to-join="loggedInUser.joinRequests"></dashboard-pending-volunteering>
        </div>
        <dashboard-cta :has-events="events.length > 0 && events[0].id" :is-ticketing-admin="ticketingAdmins.length > 0"></dashboard-cta>
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
  import DashboardHeader from '@/dashboard/cd-dashboard-header';
  import DashboardCreateEvent from '@/dashboard/events/cd-dashboard-create-event';
  import DashboardAdminSurvey from '@/dashboard/cd-dashboard-admin-survey';
  import DashboardCta from '@/dashboard/cd-dashboard-cta';
  import DashboardPendingVolunteering from '@/dashboard/cd-dashboard-pending-volunteering';
  import UpcomingEvent from './events/cd-dashboard-upcoming-event';

  export default {
    name: 'cd-dashboard-events',
    components: {
      UpcomingEvent,
      DashboardHeader,
      DashboardCreateEvent,
      DashboardAdminSurvey,
      DashboardCta,
      DashboardPendingVolunteering,
    },
    data() {
      return {
        events: [{}, {}],
        oldEvents: null,
        usersDojos: [],
        dojos: {},
        leads: [],
      };
    },
    computed: {
      ...mapGetters(['loggedInUser', 'hasRequests']),
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
        return this.usersDojos.filter(usersDojo =>
          usersDojo.userPermissions && usersDojo.userPermissions.find(perm => perm.name === 'ticketing-admin'));
      },
      dojoAdmins() {
        return this.usersDojos.filter(usersDojo =>
          usersDojo.userPermissions && usersDojo.userPermissions.find(perm => perm.name === 'dojo-admin'));
      },
      hasDojos() {
        return Object.keys(this.dojos).length > 0;
      },
  
      firstDojo() {
        return this.hasDojos ? this.dojos[this.dojoAdmins[0].dojoId] : {};
      },
    },
    methods: {
      dojoAge(dojo, format) {
        return moment().diff(dojo.created, format);
      },
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
        this.events = [];
      },
      async loadUserDojos() {
        const res = await DojosService.getUsersDojos(this.loggedInUser.id);
        this.usersDojos = res.body;
      },
      async loadDojos() {
        const dojoIds = Object.keys(this.usersDojosMap);
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
    
    &__list-filler {
      background: @cd-very-light-grey;
      height: 90px;
      margin: @margin*2 0;
    }
  }
</style>
