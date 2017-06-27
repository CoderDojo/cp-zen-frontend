<template>
  <div class="cd-booking">
    <h2>Tickets:</h2>
    <ul>
      <li class="cd-booking-tickets" v-for="ticket in tickets">
        {{ticket.selectedTickets.length}} X {{ ticket.selectedTickets[0].ticket.name }} ({{ ticket.session.name }})
      </li>
    </ul>
    <form>
      <bookingParentForm :eventId="eventId" :tickets="tickets" ref="bookingParentFormRef"></bookingParentForm>
      <bookingCreateAccount :eventId="eventId" ref="bookingCreateAccountRef"></bookingCreateAccount>
    </form>
    <input type="button" @click="onSubmit()" value="Submit Booking"/>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import BookingParentForm from '@/events/cd-booking-parent-form';
  import BookingCreateAccount from '@/events/cd-booking-create-account';


  export default {
    name: 'Booking',
    props: ['eventId'],
    components: {
      bookingParentForm: BookingParentForm,
      bookingCreateAccount: BookingCreateAccount,
    },
    data() {
      return {
        tickets: {},
      };
    },
    methods: {
      loadSessionData() {
        this.tickets = StoreService.load(`booking-${this.eventId}-sessions`);
      },
      onSubmit() {
        if (this.isValidChildForm()) {
          this.$refs.bookingParentFormRef.submitBooking();
          this.$refs.bookingCreateAccountRef.submitAccount()
            .then(() => {
              this.$router.push(`/events/${this.eventId}/confirmation`);
            });
        }
      },
      isValidChildForm() {
        if (!this.$refs.bookingCreateAccountRef.getRecaptchaResponse()) {
          // eslint-disable-next-line
          window.alert('Please complete the reCAPTCHA.');
          return false;
        }
        return this.$refs.bookingParentFormRef.isValid() &&
          this.$refs.bookingCreateAccountRef.isValid();
      },
    },
    created() {
      this.loadSessionData();
    },
  };
</script>
<style scoped></style>
