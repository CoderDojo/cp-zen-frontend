import moment from 'moment';
import EventStore from '@/events/event-store';
// import { mutations } from '@/events/event-store';

describe('Event Store', () => {
  let clock;

  beforeEach(() => {
    // Tues Jun 04 2019 10AM
    clock = sinon.useFakeTimers({
      now: 1559638800000,
    });

    const event = {
      name: '',
      description: '',
      address: '',
      city: {},
      country: {},
      dojoId: '',
      type: 'one-off',
      status: 'published',
      recurringType: 'weekly',
      public: true,
      useDojoAddress: false,
      ticketApproval: false,
      notifyOnApplicant: false,
      sendEmails: true,
      newForm: true,
      dates: [{ startTime: moment(), endTime: moment() }],
      sessions: [
        {
          name: 'Dojo',
          description: 'Dojo Session',
          tickets: [
            { name: 'Youth', type: 'ninja', quantity: 20 },
            { name: 'Mentor', type: 'mentor', quantity: 5 },
          ],
        },
      ],
    };

    EventStore.commit('setEvent', event);
    EventStore.commit('updateStartTime', '09:00');
    EventStore.commit('updateEndTime', '11:00');
    EventStore.commit('updateEventDate', moment().format('YYYY-MM-DD'));
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('mutations', () => {
    describe('mutations.setEvent', () => {
      it('sets event values correctly with default sendEmails', () => {
        const event = { id: 1, name: 'Event name' };
        EventStore.commit('setEvent', event);

        console.log(EventStore.state.event);
        expect(EventStore.state.event).to.deep.equal({
          id: 1,
          name: 'Event name',
          sendEmails: false,
        });
      });
    });

    describe('mutations.setEventName', () => {
      it('sets event name correctly', () => {
        EventStore.commit('setEventName', 'Wimbledon');
        expect(EventStore.state.event.name).to.eql('Wimbledon');
      });
    });

    describe('mutations.setCityFromObject', () => {
      context('when city object has nameWithHierarcy', () => {
        it('sets city correctly', () => {
          EventStore.commit('setCityFromObject', { nameWithHierarchy: 'Sheffield' });
          expect(EventStore.state.event.city).to.eql({ nameWithHierarchy: 'Sheffield' });
        });
      });
      context('when city object has toponymName', () => {
        it('sets city correctly', () => {
          EventStore.commit('setCityFromObject', { toponymName: 'Sheffield' });
          expect(EventStore.state.event.city).to.eql({ nameWithHierarchy: 'Sheffield' });
        });
      });
    });

    describe('mutations.setAddress', () => {
      it('sets address correctly', () => {
        EventStore.commit('setAddress', '123 Fake Street, PO1 1OP');
        expect(EventStore.state.event.address).to.eql('123 Fake Street, PO1 1OP');
      });
    });

    describe('mutations.setDescription', () => {
      it('sets description correctly', () => {
        EventStore.commit('setDescription', 'Lovely description');
        expect(EventStore.state.event.description).to.eql('Lovely description');
      });
    });

    describe('mutations.setCity', () => {
      it('sets city correctly', () => {
        EventStore.commit('setCity', 'Sheffield');
        expect(EventStore.state.event.city).to.eql({ nameWithHierarchy: 'Sheffield' });
      });
    });

    describe('mutations.setCountry', () => {
      it('sets country correctly', () => {
        EventStore.commit('setCountry', { alpha2: 'GB', alpha3: 'GBR' });
        expect(EventStore.state.event.country).to.eql({ alpha2: 'GB', alpha3: 'GBR' });
      });
    });

    describe('mutations.setDojoId', () => {
      it('sets dojo ID correctly', () => {
        EventStore.commit('setDojoId', 'someuuid');
        expect(EventStore.state.event.dojoId).to.eql('someuuid');
      });
    });

    describe('mutations.generateNextEventDates', () => {
      it('sets startTime to match previous event', () => {
        const startTime = moment.utc('2019-06-14T11:00:00.000Z');
        const endTime = moment.utc('2019-06-14T14:00:00.000Z');
        EventStore.commit('generateNextEventDates',
          { lastStartTime: startTime, lastEndTime: endTime });

        expect(EventStore.state.startTime).to.eql('11:00');
      });

      it('sets event startTime to match previous event', () => {
        const startTime = moment.utc('2019-06-14T11:00:00.000Z');
        const endTime = moment.utc('2019-06-14T14:00:00.000Z');
        EventStore.commit('generateNextEventDates',
          { lastStartTime: startTime, lastEndTime: endTime });

        expect(EventStore.state.event.dates[0].startTime.toString())
          .to.eql(moment.utc('2019-06-21 11:00').toString());
      });

      it('sets endTime to match previous event', () => {
        const startTime = moment.utc('2019-06-14T11:00:00.000Z');
        const endTime = moment.utc('2019-06-14T14:00:00.000Z');
        EventStore.commit('generateNextEventDates',
          { lastStartTime: startTime, lastEndTime: endTime });

        expect(EventStore.state.endTime).to.eql('14:00');
      });

      it('sets event endTime to match previous event', () => {
        const startTime = moment.utc('2019-06-14T11:00:00.000Z');
        const endTime = moment.utc('2019-06-14T14:00:00.000Z');
        EventStore.commit('generateNextEventDates',
          { lastStartTime: startTime, lastEndTime: endTime });

        expect(EventStore.state.event.dates[0].endTime.toString())
          .to.eql(moment.utc('2019-06-21 14:00').toString());
      });

      context('when lastStartTime is in the future', () => {
        it('sets eventDate 1 week after last start date', () => {
          const startTime = moment.utc('2019-06-14T11:00:00.000Z');
          const endTime = moment.utc('2019-06-14T14:00:00.000Z');
          EventStore.commit('generateNextEventDates',
            { lastStartTime: startTime, lastEndTime: endTime });

          expect(EventStore.state.eventDate).to.eql('2019-06-21');
        });
      });
      context('when lastStartTime was less than a week ago', () => {
        it('sets eventDate to next occurrence of same day', () => {
          const startTime = moment.utc('2019-06-01T11:00:00.000Z');
          const endTime = moment.utc('2019-06-01T12:00:00.000Z');
          EventStore.commit('generateNextEventDates',
            { lastStartTime: startTime, lastEndTime: endTime });

          expect(EventStore.state.eventDate).to.eql('2019-06-08');
        });
      });
      context('when lastStartTime was more than a week ago', () => {
        it('sets eventDate to next occurrence of same day', () => {
          // last event was on a Sunday a month ago
          // eventDate should be the next Sunday
          const startTime = moment.utc('2019-05-19T11:00:00.000Z');
          const endTime = moment.utc('2019-05-19T12:00:00.000Z');
          EventStore.commit('generateNextEventDates',
            { lastStartTime: startTime, lastEndTime: endTime });

          expect(EventStore.state.eventDate).to.eql('2019-06-09');
        });
      });
    });

    describe('mutations.setTicketQuantitiesFromEvent', () => {
      context('when previous event contains matching session', () => {
        it('sets quantities for mentor and youth tickets', async () => {
          const event = {
            sessions: [{
              tickets: [
                { name: 'Youth', quantity: 77 },
                { name: 'Mentor', quantity: 45 },
              ],
            }],
          };
          EventStore.commit('setTicketQuantitiesFromEvent', event);
          const tickets = EventStore.state.event.sessions[0].tickets;
          const youthTickets = tickets.find(t => t.name === 'Youth');
          expect(youthTickets.quantity).to.eql(77);
          const mentorTickets = tickets.find(t => t.name === 'Mentor');
          expect(mentorTickets.quantity).to.eql(45);
        });
      });

      context('when previous event does not contain matching session', () => {
        it('does not set quantities for mentor and youth tickets', async () => {
          const event = {
            sessions: [{
              tickets: [
                { name: 'HTML', quantity: 77 },
                { name: 'Scratch', quantity: 45 },
              ],
            }],
          };
          EventStore.commit('setTicketQuantitiesFromEvent', event);
          const tickets = EventStore.state.event.sessions[0].tickets;
          const youthTickets = tickets.find(t => t.name === 'Youth');
          expect(youthTickets.quantity).to.eql(20); // default
          const mentorTickets = tickets.find(t => t.name === 'Mentor');
          expect(mentorTickets.quantity).to.eql(5); // default
        });
      });

      context('when event has no session', () => {
        it('does not set quantities for mentor and youth tickets', async () => {
          const event = {
            sessions: [],
          };
          EventStore.commit('setTicketQuantitiesFromEvent', event);
          const tickets = EventStore.state.event.sessions[0].tickets;
          const youthTickets = tickets.find(t => t.name === 'Youth');
          expect(youthTickets.quantity).to.eql(20); // default
          const mentorTickets = tickets.find(t => t.name === 'Mentor');
          expect(mentorTickets.quantity).to.eql(5); // default
        });
      });
    });

    describe('mutations.updateEventDate', () => {
      it('sets eventDate correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');

        expect(EventStore.state.eventDate).to.eql('2019-08-24');
      });

      it('sets event startTime correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');
        expect(EventStore.state.event.dates[0].startTime.toString())
          .to.eql(moment.utc('2019-08-24 09:00').toString());
      });

      it('sets event endTime correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');
        expect(EventStore.state.event.dates[0].endTime.toString())
          .to.eql(moment.utc('2019-08-24 11:00').toString());
      });
    });

    describe('mutations.updateEventDate', () => {
      it('sets eventDate correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');

        expect(EventStore.state.eventDate).to.eql('2019-08-24');
      });

      it('sets event startTime correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');
        expect(EventStore.state.event.dates[0].startTime.toString())
          .to.eql(moment.utc('2019-08-24 09:00').toString());
      });

      it('sets event endTime correctly', () => {
        EventStore.commit('updateEventDate', '2019-08-24');
        expect(EventStore.state.event.dates[0].endTime.toString())
          .to.eql(moment.utc('2019-08-24 11:00').toString());
      });
    });

    describe('mutations.updateStartTime', () => {
      it('sets startTime correctly', () => {
        EventStore.commit('updateStartTime', '13:00');

        expect(EventStore.state.startTime).to.eql('13:00');
      });

      it('sets event startTime correctly', () => {
        EventStore.commit('updateStartTime', '13:00');
        expect(EventStore.state.event.dates[0].startTime.toString())
          .to.eql(moment.utc('2019-06-04 13:00').toString());
      });
    });

    describe('mutations.updateEndTime', () => {
      it('sets startTime correctly', () => {
        EventStore.commit('updateEndTime', '18:00');

        expect(EventStore.state.endTime).to.eql('18:00');
      });

      it('sets event endTime correctly', () => {
        EventStore.commit('updateEndTime', '19:00');
        expect(EventStore.state.event.dates[0].endTime.toString())
          .to.eql(moment.utc('2019-06-04 19:00').toString());
      });
    });

    describe('mutations.updateTicketQuantity', () => {
      it('sets ninja ticket quantity correctly', () => {
        const tickets = [
          { name: 'Youth', type: 'ninja', quantity: 99 },
          { name: 'Mentor', type: 'mentor', quantity: 5 },
        ];

        EventStore.commit('updateTicketQuantity', { type: 'ninja', quantity: 99 });
        expect(EventStore.state.event.sessions[0].tickets).to.eql(tickets);
      });

      it('sets mentor ticket quantity correctly', () => {
        const tickets = [
          { name: 'Youth', type: 'ninja', quantity: 20 },
          { name: 'Mentor', type: 'mentor', quantity: 77 },
        ];

        EventStore.commit('updateTicketQuantity', { type: 'mentor', quantity: 77 });
        expect(EventStore.state.event.sessions[0].tickets).to.eql(tickets);
      });
    });

    describe('mutations.setSendEmails', () => {
      it('sets event name correctly', () => {
        expect(EventStore.state.event.sendEmails).to.eql(false);
        EventStore.commit('setSendEmails', true);
        expect(EventStore.state.event.sendEmails).to.eql(true);
      });
    });
  });

  describe('getters', () => {
    describe('getters.ticketQuantity', () => {
      it('gets the quantity for ninja type', () => {
        const expected = EventStore.getters.ticketQuantity('ninja');
        expect(expected).to.eql(20); // default
      });

      it('gets the quantity for mentor type', () => {
        const expected = EventStore.getters.ticketQuantity('mentor');
        expect(expected).to.eql(5); // default
      });
    });
  });
});
