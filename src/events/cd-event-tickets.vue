<template>
  <ul>
    <li v-for="ticket in tickets" class="cd-event-tickets__item">
      {{ ticket.name }}
      <number-spinner min="0" :max="ticket.quantity - ticket.approvedApplications"
                      v-on:update="onTicketQuantityUpdate(ticket.id, $event)"></number-spinner>
    </li>
  </ul>
</template>

<script>
  import NumberSpinner from '@/common/cd-number-spinner';
  import StoreService from '@/store/store-service';

  export default {
    name: 'EventTickets',
    props: ['tickets', 'sessionId'],
    data() {
      return {
        selectedTickets: {},
      };
    },
    components: {
      NumberSpinner,
    },
    methods: {
      onTicketQuantityUpdate(ticketId, value) {
        if (value === 0 && this.selectedTickets[ticketId]) {
          delete this.selectedTickets[ticketId];
        } else if (value > 0) {
          this.selectedTickets[ticketId] = value;
        }

        const booking = StoreService.load('booking-sessions') || {};
        booking[this.sessionId] = this.selectedTickets;
        StoreService.save('booking-sessions', booking);
      },
    },
  };
</script>
