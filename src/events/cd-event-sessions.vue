<template>
  <div class="cd-event-sessions">
    <h1>Sessions</h1>
    <div v-for="session in sessions">
      <h3 class="cd-event-sessions__item">{{ session.name }} - {{ session.description }}</h3>
      <event-tickets :tickets="session.tickets"></event-tickets>
    </div>
  </div>
</template>
<script>
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
      };
    },
    methods: {
      loadSessions() {
        service.loadSessions(this.eventId).then((response) => {
          this.sessions = response.body;
        });
      },
    },
    created() {
      this.loadSessions();
    },
  };
</script>
<style scoped>
</style>
