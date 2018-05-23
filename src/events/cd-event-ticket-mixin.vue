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
      ticketIsFull(ticket, applications = []) {
        const sameTicketApplications = applications
          .filter(t => t.ticketId === ticket.id);
        return (ticket.approvedApplications + sameTicketApplications.length) >= ticket.quantity;
      },
      ticketsAreFull(tickets, applications = []) {
        return tickets.every(t => this.ticketIsFull(t, applications));
      },
    },
  };
</script>
