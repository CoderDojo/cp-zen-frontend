<template>
  <div class="cd-event-details">
    <h1 v-if="eventDetails.name" class="cd-event-details__name">{{ eventDetails.name }}</h1>
    <label for="dob">Date of birth</label>
    <input type="input" class="cd-event-details__dob" id="dob" placeholder="dd/mm/yyyy">
    <input type="button" class="cd-event-details__next" @click="next()" value="Next">
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
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
      next() {
        StoreService.save('selected-event', this.eventDetails);
        this.$router.push(`/events/${this.eventId}/sessions`);
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
