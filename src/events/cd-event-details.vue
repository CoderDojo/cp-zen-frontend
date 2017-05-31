<template>
  <div>
    <h1 v-if="eventDetails.name" class="cd-event-details__name">{{ eventDetails.name }}</h1>
  </div>
</template>
<script>
  import EventService from './service';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
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
