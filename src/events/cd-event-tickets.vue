<template>
  <div>
    <div v-for="ticket in tickets" class="cd-event-tickets__ticket">
      <span class="cd-event-tickets__name">{{ ticket.name }}</span>
      <number-spinner min="0" :max="ticket.quantity - ticket.approvedApplications"
                      v-on:update="onTicketQuantityUpdate(ticket.id, $event)"></number-spinner>
    </div>
  </div>
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
<style scoped lang="less">
  .cd-event-tickets {
    &__ticket {
      display: flex;
      align-items: center;
      margin: 16px 0;
    }

    &__name {
      min-width: 150px;
    }
  }
</style>
