<template>
  <div>
    <div v-for="ticket in tickets" v-if="!(isYouthOverThirteen && ticket.type === 'parent-guardian')" class="cd-event-tickets__ticket">
      <span class="cd-event-tickets__name">{{ ticket.name }}</span>
      <number-spinner min="0" :max="ticket.quantity - ticket.approvedApplications"
                      v-on:update="onTicketQuantityUpdate(ticket, $event)"></number-spinner>
    </div>
  </div>
</template>

<script>
  import NumberSpinner from '@/common/cd-number-spinner';
  import StoreService from '@/store/store-service';
  import UsersUtil from '@/users/util';

  export default {
    name: 'EventTickets',
    props: ['tickets', 'session', 'eventId'],
    data() {
      return {
        selectedTickets: {},
      };
    },
    components: {
      NumberSpinner,
    },
    methods: {
      onTicketQuantityUpdate(ticket, value) {
        const previousValue = this.selectedTickets[ticket.id] || 0;
        if (value === 0 && this.selectedTickets[ticket.id]) {
          delete this.selectedTickets[ticket.id];
        } else if (value > 0) {
          this.selectedTickets[ticket.id] = value;
        }
        this.updateStoredSelectedTickets(ticket, previousValue);
      },
      updateStoredSelectedTickets(ticket, previousValue) {
        const bookingData = StoreService.load(`booking-${this.eventId}-sessions`) || {};
        if (!bookingData[ticket.id]) bookingData[ticket.id] = {};

        if (!this.selectedTickets[ticket.id]) {
          delete bookingData[ticket.id];
        } else if (this.selectedTickets[ticket.id] > previousValue) {
          bookingData[ticket.id].session = this.session;
          if (!bookingData[ticket.id].selectedTickets) bookingData[ticket.id].selectedTickets = [];
          bookingData[ticket.id].selectedTickets.push({ ticket });
        } else if (this.selectedTickets[ticket.id] < previousValue) {
          const matchingTicket = bookingData[ticket.id].selectedTickets
            .find(selectedTicket => selectedTicket.ticket.id === ticket.id);
          bookingData[ticket.id].selectedTickets
            .splice(bookingData[ticket.id].selectedTickets.indexOf(matchingTicket), 1);
        }
        StoreService.save(`booking-${this.eventId}-sessions`, bookingData);
        this.$emit('update');
      },
    },
    computed: {
      isYouthOverThirteen: () => UsersUtil.isYouthOverThirteen(new Date(StoreService.load('applicant-dob'))),
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
      font-weight: bold;
    }
  }
</style>
