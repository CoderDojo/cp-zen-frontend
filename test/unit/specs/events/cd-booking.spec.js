import vueUnitHelper from 'vue-unit-helper';
import BookingComponent from '!!vue-loader?inject!@/events/cd-booking';

describe('Booking Page', () => {
  it('should load saved sessions data', () => {
    const MockStoreService = {
      load: sinon.stub(),
    };
    MockStoreService.load.withArgs('selected-event').returns({
      sessions: [
        {
          name: 'Session 1',
          id: 'abc',
          tickets: [
            {
              id: 'ticket-1',
              name: 'Ticket 1',
              type: 'type-a',
            },
            {
              id: 'ticket-2',
              name: 'Ticket 2',
              type: 'type-b',
            },
          ],
        },
        {
          name: 'Session 2',
          id: 'xyz',
          tickets: [
            {
              id: 'ticket-100',
              name: 'Ticket 100',
              type: 'type-c',
            },
            {
              id: 'ticket-101',
              name: 'Ticket 101',
              type: 'type-d',
            },
          ],
        },
      ],
    });

    MockStoreService.load.withArgs('booking-sessions').returns({
      abc: {
        'ticket-1': 2,
      },
      xyz: {
        'ticket-100': 100,
      },
    });

    const BookingComponentWithMocks = BookingComponent({
      '@/store/store-service': MockStoreService,
    });

    const vm = vueUnitHelper(BookingComponentWithMocks);

    // ACT
    const bindingData = { tickets: [] };
    vm.loadSessionData.bind(bindingData)();

    // ASSERT
    expect(MockStoreService.load).to.be.calledTwice;
    expect(MockStoreService.load).to.be.calledWith('selected-event');
    expect(MockStoreService.load).to.be.calledWith('booking-sessions');
    expect(bindingData.tickets).to.deep.equal(
      [
        { id: 'ticket-1', name: 'Ticket 1', quantity: 2, sessionName: 'Session 1', type: 'type-a' },
        { id: 'ticket-100', name: 'Ticket 100', quantity: 100, sessionName: 'Session 2', type: 'type-c' },
      ]);
  });
});

