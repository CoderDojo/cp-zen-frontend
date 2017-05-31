<template>
  <div class="cd-booking-parent-form">
    <form @submit.prevent="submitBooking">
      <label for="firstName">Name</label>
      <input type="text" name="firstName" id="firstName" v-model="firstName">
      <input type="text" name="lastName" id="lastName" v-model="lastName">
      <label for="phoneNumber">Phone Number</label>
      <input type="text" name="phoneNumber" id="phoneNumber" v-model="phoneNumber">
      <label for="email">Email Address</label>
      <input type="text" name="email" id="email" v-model="email">
      <input type="submit" value="Submit Booking"/>
    </form>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import { pick } from 'lodash';

  export default {
    name: 'bookingParentForm',
    props: ['eventId'],
    data() {
      return {
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
      };
    },
    methods: {
      submitBooking() {
        StoreService.save(`booking-${this.eventId}`, { parent: pick(this, ['firstName', 'lastName', 'phoneNumber', 'email']) });
        this.$router.push(`/events/${this.eventId}/create-account`);
      },
    },
  };
</script>
<style scoped></style>
