<script>
  export default {
    name: 'ticket',
    computed: {
      tickets() {
        return this.event.sessions ?
          this.event.sessions.reduce((red, s) => red.concat(s.tickets), []) :
          [];
      },
    },
    methods: {
      ticketIsFull(ticket) {
        // When it's already full before the user's booking
        // TODO : take into account current booking
        const sameTicketApplications = (this.applications || [])
          .filter(t => t.ticketId === ticket.id);
        return (ticket.approvedApplications + sameTicketApplications.length) >= ticket.quantity;
      },
      ticketsAreFull(tickets) {
        return tickets.every(t => this.ticketIsFull(t));
      },
    },
  };
</script>
