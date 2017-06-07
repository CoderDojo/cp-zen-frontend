<template>
  <div class="cd-booking">
    <h2>Tickets:</h2>
    <ul>
      <li class="cd-booking-tickets" v-for="ticket in tickets">
        {{ticket.quantity}} X {{ ticket.name }} ({{ ticket.sessionName }})
      </li>
    </ul>

    <bookingParentForm :eventId="eventId"></bookingParentForm>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import BookingParentForm from '@/events/cd-booking-parent-form';
  import { find } from 'lodash';

  function getSelectedSessions(booking) {
    return Object.keys(booking);
  }

  function getSelectedTicketsPerSession(booking, sessionId) {
    return Object.keys(booking[sessionId]);
  }

  function storeTicket(tickets, name, quantity, sessionName) {
    tickets.push({ name, quantity, sessionName });
  }
  export default {
    name: 'Booking',
    props: ['eventId'],
    components: {
      bookingParentForm: BookingParentForm,
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
          getSelectedTicketsPerSession(booking, sessionId).forEach((ticketId) => {
            const ticket = find(session.tickets, t => t.id === ticketId);
            storeTicket(this.tickets, ticket.name, booking[sessionId][ticketId], session.name);
          });
        });
      },
    },
    created() {
      this.loadSessionData();
    },
  };
</script>
<style scoped></style>
