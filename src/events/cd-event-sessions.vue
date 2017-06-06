<template>
  <div class="cd-event-sessions">
    <h1 v-if="event" class="cd-event-session__event-name">{{ event.name }}</h1>
    <h1>Sessions</h1>
    <div v-for="session in sessions">
      <h3 class="cd-event-sessions__item">{{ session.name }} - {{ session.description }}</h3>
      <event-tickets :tickets="session.tickets"></event-tickets>
    </div>
    <router-link :to="{name: 'EventBookingForm', params: {eventId: event.id}}" class="cd-event-sessions__next" tag="button">{{ event.name }}</router-link>
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
<style scoped>
</style>
