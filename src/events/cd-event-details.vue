<template>
  <div>
    <h1 v-if="eventDetails.name" class="cd-event-details__name">{{ eventDetails.name }}</h1>
    <event-sessions :eventId="eventId"></event-sessions>
  </div>
</template>
<script>
  import EventService from './service';
  import EventSessions from './cd-event-sessions';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
    components: {
      EventSessions,
    },
    data() {
      return {
        eventDetails: {},
      };
    },
    methods: {
      loadEvent() {
        EventService.loadEvent(this.eventId)
          .then((response) => {
            this.eventDetails = response.body;
          });
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
