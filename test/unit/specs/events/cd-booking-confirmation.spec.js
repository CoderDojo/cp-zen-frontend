import vueUnitHelper from 'vue-unit-helper';
import BookingConfirmationComponent from '!!vue-loader?inject!@/events/cd-booking-confirmation';

describe('Booking Confirmation Component', () => {
  let sandbox;
  let MockStoreService;
  let BookingConfirmationComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      load: sandbox.stub(),
    };
    BookingConfirmationComponentWithMocks = BookingConfirmationComponent({
      '@/store/store-service': MockStoreService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods.loadBookingData()', () => {
    it('should load create user and booking data from the store', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      vm.eventId = 1;
      MockStoreService.load.withArgs(`booking-${vm.eventId}-user`).returns('user');
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns('sessions');

      // ACT
      vm.loadBookingData();

      // ASSERT
      expect(vm.createdUser).to.equal('user');
      expect(vm.bookingData).to.equal('sessions');
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

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadBookingData).to.have.been.calledOnce;
    });
  });
});
