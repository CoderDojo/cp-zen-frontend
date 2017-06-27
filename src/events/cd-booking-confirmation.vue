<template>
  <div class="cd-booking-confirmation">
    <p class="cd-booking-confirmation__account-creation-confirmation">Account created</p>
    <ul v-if="createdUser.firstName">
      <li class="cd-booking-confirmation__first-name">{{ createdUser.firstName }}</li>
      <li class="cd-booking-confirmation__last-name">{{ createdUser.lastName }}</li>
      <li class="cd-booking-confirmation__phone-number">{{ createdUser.phone }}</li>
      <li class="cd-booking-confirmation__email">{{ createdUser.email }}</li>
    </ul>
    <p class="cd-booking-confirmation__booking-confirmation">Your booking is completed successfully</p>
    <ul v-for="booking in bookings">
      <li class="cd-booking-confirmation__booking-ticket-name">{{ booking.ticket.name }}</li>
      <li class="cd-booking-confirmation__booking-first-name">{{ booking.user.firstName }}</li>
      <li class="cd-booking-confirmation__booking-last-name">{{ booking.user.lastName }}</li>
      <li class="cd-booking-confirmation__booking-dob-date">{{ booking.user.dob && booking.user.dob.date }}</li>
      <li class="cd-booking-confirmation__booking-dob-month">{{ booking.user.dob && booking.user.dob.month }}</li>
      <li class="cd-booking-confirmation__booking-dob-year">{{ booking.user.dob && booking.user.dob.year }}</li>
      <li class="cd-booking-confirmation__booking-email">{{ booking.user.email }}</li>
      <li class="cd-booking-confirmation__booking-gender">
        {{ booking.user.gender }} <span v-if="booking.user.otherGender">({{ booking.user.otherGender }})</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';

  export default {
    name: 'bookingConfirmation',
    props: ['eventId'],
    data() {
      return {
        createdUser: {},
        bookingData: {},
      };
    },
    computed: {
      bookings() {
        let bookings = [];
        Object.keys(this.bookingData).forEach((ticketId) => {
          const booking = this.bookingData[ticketId];
          bookings = bookings.concat(booking.selectedTickets);
        });
        return bookings;
      },
    },
    methods: {
      loadBookingData() {
        this.createdUser = StoreService.load(`booking-${this.eventId}-user`);
        this.bookingData = StoreService.load(`booking-${this.eventId}-sessions`);
      },
    },
    created() {
      this.loadBookingData();
    },
  };
</script>
<style scoped></style>
