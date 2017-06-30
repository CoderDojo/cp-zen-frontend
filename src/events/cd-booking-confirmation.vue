<template>
  <div class="cd-booking-confirmation">
    <p class="cd-booking-confirmation__account-creation-confirmation">{{ $t('Account created') }}</p>
    <p class="cd-booking-confirmation__joined-dojo-confirmation">{{ $t('Dojo joined successfully') }}</p>
    <p class="cd-booking-confirmation__dojo-name">{{ dojoName }}</p>
    <p class="cd-booking-confirmation__booking-confirmation">{{ $t('Your booking is completed successfully') }}</p>
    <ul v-if="createdUser.firstName">
      <li class="cd-booking-confirmation__first-name">{{ createdUser.firstName }}</li>
      <li class="cd-booking-confirmation__last-name">{{ createdUser.lastName }}</li>
      <li class="cd-booking-confirmation__dob">{{ createdUser.dob }}</li>
      <li class="cd-booking-confirmation__phone-number">{{ createdUser.phone }}</li>
      <li class="cd-booking-confirmation__email">{{ createdUser.email }}</li>
    </ul>
    <p class="cd-booking-confirmation__event-name">{{ selectedEvent.name }}</p>
    <p class="cd-booking-confirmation__event-location">{{ selectedEvent.address }}</p>
    <div v-html="selectedEvent.description" class="cd-booking-confirmation__event-description"></div>
    <ul v-for="booking in bookings">
      <li class="cd-booking-confirmation__booking-ticket-session-name">{{ getSessionName(booking.ticket.id) }}</li>
      <li class="cd-booking-confirmation__booking-ticket-type">{{ booking.ticket.type }}</li>
      <li class="cd-booking-confirmation__booking-ticket-name">{{ booking.ticket.name }}</li>
      <li class="cd-booking-confirmation__booking-first-name">{{ booking.user.firstName }}</li>
      <li class="cd-booking-confirmation__booking-last-name">{{ booking.user.lastName }}</li>
      <li class="cd-booking-confirmation__booking-dob">{{ booking.user.dob }}</li>
      <li class="cd-booking-confirmation__booking-email">{{ booking.user.email }}</li>
      <li class="cd-booking-confirmation__booking-gender">
        {{ booking.user.gender }} <span v-if="booking.user.otherGender">({{ booking.user.otherGender }})</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import DojosService from '@/dojos/service';

  export default {
    name: 'bookingConfirmation',
    props: ['eventId'],
    data() {
      return {
        createdUser: {},
        bookingData: {},
        selectedEvent: {},
        dojoName: null,
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
        this.selectedEvent = StoreService.load('selected-event');
      },
      getSessionName(ticketId) {
        return this.bookingData[ticketId].session.name;
      },
      getDojoName() {
        DojosService.getDojoById(this.selectedEvent.dojoId).then((res) => {
          this.dojoName = res.body.name;
        });
      },
    },
    created() {
      this.loadBookingData();
      this.getDojoName();
    },
  };
</script>
<style scoped></style>
