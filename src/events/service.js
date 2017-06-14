import Vue from 'vue';

const EventsService = {

  loadEvents(dojoId) {
    return Vue.http.post(`${Vue.config.apiBase}/events/search`,
      {
        query: { dojoId, filterPastEvents: true, status: 'published' },
      },
    );
  },
  loadEvent(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}`);
  },
  loadSessions(eventId) {
    return Vue.http.get(`${Vue.config.apiBase}/events/${eventId}/sessions`);
  },
  bookTickets(user, selectedEvent, selectedSessionTickets) {
    const dojoId = selectedEvent.dojoId;
    const eventId = selectedEvent.id;
    const userId = user.id;
    const sessionId = Object.keys(selectedSessionTickets)[0];
    const ticketId = Object.keys(selectedSessionTickets[sessionId])[0];
    const session = selectedEvent.sessions.filter(s => s.id === sessionId)[0];
    const ticket = session.tickets.filter(tck => tck.id === ticketId)[0];
    const ticketName = ticket.name;
    const ticketType = ticket.type;

    const payload = {
      applications: [
        {
          dojoId,
          eventId,
          sessionId,
          ticketName,
          ticketType,
          ticketId,
          userId,
          notes: 'N/A',
          emailSubject: {
            received: 'foo',
            approved: 'bar',
          },
        },
      ],
    };
    return Vue.http.post(`${Vue.config.apiBase}/events/bulk-apply-applications`, payload);
  },
};

export default EventsService;
