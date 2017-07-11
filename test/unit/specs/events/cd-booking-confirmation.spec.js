import vueUnitHelper from 'vue-unit-helper';
import BookingConfirmationComponent from '!!vue-loader?inject!@/events/cd-booking-confirmation';

describe('Booking Confirmation Component', () => {
  let sandbox;
  let MockStoreService;
  let MockDojoService;
  let BookingConfirmationComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      load: sandbox.stub(),
    };
    MockDojoService = {
      getDojoById: sandbox.stub(),
    };
    BookingConfirmationComponentWithMocks = BookingConfirmationComponent({
      '@/store/store-service': MockStoreService,
      '@/dojos/service': MockDojoService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods.getDojo', () => {
    it('should load dojo', (done) => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      vm.selectedEvent = { dojoId: '1' };
      vm.dojo = '';
      const expectedDojo = { name: 'foo' };

      MockDojoService.getDojoById.withArgs('1').returns(
        Promise.resolve(
          {
            body: expectedDojo,
          },
        ),
      );

      // ACT
      vm.getDojo();

      // ASSERT
      requestAnimationFrame(() => {
        expect(vm.dojo).to.equal(expectedDojo);
        done();
      });
    });
  });

  describe('methods.loadBookingData()', () => {
    it('should load create user and booking data from the store', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      vm.eventId = 1;
      MockStoreService.load.withArgs(`booking-${vm.eventId}-user`).returns('user');
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns('sessions');
      MockStoreService.load.withArgs('selected-event').returns('event');

      // ACT
      vm.loadBookingData();

      // ASSERT
      expect(vm.createdUser).to.equal('user');
      expect(vm.bookingData).to.equal('sessions');
      expect(vm.selectedEvent).to.equal('event');
    });
  });

  describe('methods.getSessionName', () => {
    it('should get the session name for the ticket.id', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      const ticketId = 'foo';
      vm.bookingData = {
        foo: {
          session: {
            id: 'bar',
            name: 'Bar Session',
          },
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
              },
              user: {
                id: 1,
              },
            },
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
              },
              user: {
                id: 2,
              },
            },
          ],
        },
        abc: {
          session: 'xyz',
          selectedTickets: [
            {
              ticket: {
                id: 'abc',
                name: 'ABC',
                sessionId: 'xyz',
              },
              user: {
                id: 3,
              },
            },
          ],
        },
      };

      // ACT
      const sessionName = vm.getSessionName(ticketId);

      // ASSERT
      expect(sessionName).to.equal('Bar Session');
    });
  });

  describe('comptuted.bookings', () => {
    it('should return an array of booked tickets', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      vm.bookingData = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
              },
              user: {
                id: 1,
              },
            },
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
              },
              user: {
                id: 2,
              },
            },
          ],
        },
        abc: {
          session: 'xyz',
          selectedTickets: [
            {
              ticket: {
                id: 'abc',
                name: 'ABC',
                sessionId: 'xyz',
              },
              user: {
                id: 3,
              },
            },
          ],
        },
      };

      // ASSERT
      expect(vm.bookings).to.deep.equal([
        {
          ticket: {
            id: 'foo',
            name: 'Foo',
            sessionId: 'bar',
          },
          user: {
            id: 1,
          },
        },
        {
          ticket: {
            id: 'foo',
            name: 'Foo',
            sessionId: 'bar',
          },
          user: {
            id: 2,
          },
        },
        {
          ticket: {
            id: 'abc',
            name: 'ABC',
            sessionId: 'xyz',
          },
          user: {
            id: 3,
          },
        },
      ]);
    });
  });

  describe('created()', () => {
    it('should load booking data', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      sandbox.stub(vm, 'loadBookingData');
      sandbox.stub(vm, 'getDojo');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadBookingData).to.have.been.calledOnce;
      expect(vm.getDojo).to.have.been.calledOnce;
    });
  });
});
