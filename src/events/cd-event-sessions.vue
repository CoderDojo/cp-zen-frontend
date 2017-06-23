<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">Select Event Tickets</h1>

    <div class="cd-event-sessions__session" v-for="session in sessions">
      <h3 class="cd-event-sessions__name">{{ session.name }}</h3>
      <p class="cd-event-sessions__description">{{ session.description }}</p>
      <event-tickets :tickets="session.tickets" :session-id="session.id" :event-id="eventId"></event-tickets>
    </div>

    <router-link :to="{name: 'EventBookingForm', params: {eventId: event.id}}"
                 class="cd-event-sessions__next btn btn-primary"
                 tag="button">Proceed
    </router-link>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import service from './service';
  import EventTickets from './cd-event-tickets';

  export default {
    name: 'sessions',
    props: ['eventId'],
    components: {
      EventTickets,
    },
    data() {
      return {
        sessions: [],
        event: null,
      };
    },
    methods: {
      loadSessions() {
        service.loadSessions(this.eventId).then((response) => {
          this.sessions = response.body;
          this.event.sessions = this.sessions;
          StoreService.save('selected-event', this.event);
        });
      },
      loadEvent() {
        this.event = StoreService.load('selected-event');
      },
    },
    created() {
      this.loadEvent();
      this.loadSessions();
    },
  };
</script>
<style scoped lang="less">
  @import "~cd-common/common/_colors";
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

