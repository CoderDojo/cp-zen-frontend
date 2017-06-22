<template>
  <div class="cd-booking">
    <h2>Tickets:</h2>
    <ul>
      <li class="cd-booking-tickets" v-for="ticket in tickets">
        {{ticket.quantity}} X {{ ticket.name }} ({{ ticket.sessionName }})
      </li>
    </ul>
    <form>
      <bookingParentForm :eventId="eventId" :tickets="tickets" ref="bookingParentFormRef" v-ref="child"></bookingParentForm>
      <bookingCreateAccount :eventId="eventId" ref="bookingCreateAccountRef" v-ref="child"></bookingCreateAccount>
    </form>
    <input type="button" @click="onSubmit()" value="Submit Booking"/>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import BookingParentForm from '@/events/cd-booking-parent-form';
  import BookingCreateAccount from '@/events/cd-booking-create-account';
  import { find } from 'lodash';

  function getSelectedSessions(booking) {
    return Object.keys(booking);
  }

  function getSelectedTicketsPerSession(booking, sessionId) {
    return Object.keys(booking[sessionId]);
  }

  function storeTicket(tickets, sessionName, quantity, ticket) {
    tickets.push({
      id: ticket.id,
      name: ticket.name,
      type: ticket.type,
      quantity,
      sessionName,
    });
  }

  export default {
    name: 'Booking',
    props: ['eventId'],
    components: {
      bookingParentForm: BookingParentForm,
      bookingCreateAccount: BookingCreateAccount,
    },
    data() {
      return {
        tickets: [],
      };
    },
    methods: {
      loadSessionData() {
        const event = StoreService.load('selected-event');
        const booking = StoreService.load('booking-sessions');

        getSelectedSessions(booking).forEach((sessionId) => {
          const session = find(event.sessions, s => s.id === sessionId);
          if (session) {
            getSelectedTicketsPerSession(booking, sessionId).forEach((ticketId) => {
              const ticket = find(session.tickets, t => t.id === ticketId);
              storeTicket(this.tickets, session.name, booking[sessionId][ticketId], ticket);
            });
          }
        });
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
