<template>
    <ul>
      <li v-for="ticket in tickets" class="cd-event-tickets__item">
        {{ ticket.name }}
        <number-spinner min="0" :max="ticket.quantity - ticket.approvedApplications"></number-spinner>
      </li>
    </ul>
</template>

<script>
  import NumberSpinner from '@/common/cd-number-spinner';

  export default {
    name: 'EventTickets',
    props: ['tickets'],
    components: {
      NumberSpinner,
    },
  };
</script>
