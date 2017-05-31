<template>
  <div class="cd-event-list">
    <h1>Upcoming Events</h1>
    <div v-for="event in events">
      <h3>
        <router-link :to="{name: 'EventDetails', params: {eventId: event.id}}" class="cd-event-list__event-name">{{ event.name }}</router-link>
      </h3>
      <span>Dates:</span> <br/>
      <ul v-for="date in event.dates">
        <li>
          <span class="cd-event-list__event-date">{{ date.startTime }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import service from './service';

  export default {
    name: 'event-list',
    props: ['dojoId'],
    data() {
      return {
        events: [],
      };
    },
    methods: {
      loadEvents() {
        service.loadEvents(this.dojoId).then((response) => {
          this.events = response.body;
        });
      },
    },
    created() {
      this.loadEvents();
    },
  };
</script>
<style scoped>
</style>
