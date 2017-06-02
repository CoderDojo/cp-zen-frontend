<template>
  <div class="cd-event-details">
    <form @submit.prevent="next">
      <h1 v-if="eventDetails.name" class="cd-event-details__name">{{ eventDetails.name }}</h1>
      <h2 v-if="isDobUnderage" class="cd-event-details__dob-error">You will need your parent to carry out the registration.</h2>
      <label for="dob-day">Date of birth</label>
      <input type="input" class="cd-event-details__dob-day" id="dob-day" placeholder="dd" v-model="day">
      <input type="input" class="cd-event-details__dob-month" id="dob-month" placeholder="mm" v-model="month">
      <input type="input" class="cd-event-details__dob-year" id="dob-year" placeholder="yyyy" v-model="year">
      <input type="submit" class="cd-event-details__next" value="Next">
    </form>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import UsersUtil from '@/users/util';
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
        isDobUnderage: false,
        day: null,
        month: null,
        year: null,
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
        this.isDobUnderage = UsersUtil.isUnderAge(this.day, this.month, this.year);
        if (this.isDobUnderage) {
          return;
        }
        StoreService.save('selected-event', this.eventDetails);
        this.$router.push(`/events/${this.eventId}/sessions`);
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
