import vueUnitHelper from 'vue-unit-helper';
import BookingParentFormComponent from '!!vue-loader?inject!@/events/cd-booking-parent-form';
import { ErrorBag } from 'vee-validate';

describe('Booking Parent Form', () => {
  let sandbox;
  let MockStoreService;
  let BookingParentFormComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.spy(),
    };
    BookingParentFormComponentWithMocks = BookingParentFormComponent({
      '@/store/store-service': MockStoreService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods.submitBooking()', () => {
    it('should store the parent user data into parent ticket if exists', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.eventId = 'foo';
      const ticketsMock = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                type: 'parent-guardian',
              },
            },
          ],
        },
      };
      vm.bookedTickets = ticketsMock;
      vm.parentTicket = ticketsMock.foo;
      vm.parentUserData = { name: 'John' };

      // ACT
      vm.submitBooking();

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledTwice;
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-user`, vm.parentUserData);
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                type: 'parent-guardian',
              },
              user: { name: 'John' },
            },
          ],
        },
      });
    });

    it('shouldnt update booking data if no parent tickets selected', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.eventId = 'foo';
      const ticketsMock = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                type: 'ninja',
              },
            },
          ],
        },
      };
      vm.tickets = ticketsMock;
      vm.bookedTickets = ticketsMock;
      vm.parentUserData = { name: 'John' };

      // ACT
      vm.submitBooking();

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledTwice;
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-user`, vm.parentUserData);
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                type: 'ninja',
              },
            },
          ],
        },
      });
    });
  });

  describe('form validation', () => {
    it('should return a valid form', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.errors = new ErrorBag();
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(true);
      expect(vm.formValidated).to.equal(true);
    });
    it('should return a invalid form with errors', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      const bag = new ErrorBag();
      bag.add('oooo');
      vm.errors = bag;
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(false);
      expect(vm.formValidated).to.equal(true);
    });
  });

  describe('computed.ninjaTickets', () => {
    it('should return ninja tickets only', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.tickets = {
        'ticket-1': {
          session: {
            name: 'session-1',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
        'ticket-2': {
          session: {
            name: 'session-1',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'parent-guardian',
              },
            },
          ],
        },
        'ticket-3': {
          session: {
            name: 'session-2',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
      };

      // ASSERT
      expect(vm.ninjaTickets).to.deep.equal({
        'ticket-1': {
          session: {
            name: 'session-1',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
        'ticket-3': {
          session: {
            name: 'session-2',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
      });
    });
  });
  describe('computed.parentTicket', () => {
    it('should return only a single parent ticket', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.tickets = {
        'ticket-1': {
          session: {
            name: 'session-1',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
        'ticket-2': {
          session: {
            name: 'session-1',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'parent-guardian',
              },
            },
          ],
        },
        'ticket-3': {
          session: {
            name: 'session-2',
          },
          selectedTickets: [
            {
              ticket: {
                type: 'ninja',
              },
            },
          ],
        },
      };

      // ASSERT
      expect(vm.parentTicket).to.deep.equal({
        session: {
          name: 'session-1',
        },
        selectedTickets: [
          {
            ticket: {
              type: 'parent-guardian',
            },
          },
        ],
      });
    });
  });

  describe('computed.parentGuardianDateOfBirth', () => {
    it('should return a date object for the ISO String stored in parentUserData', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.parentUserData = {
        dob: '1980-08-27T00:00:00.000Z',
      };

      // ASSERT
      expect(vm.parentUserDataDoB.toString())
        .to.equal(new Date(1980, 7, 27, 0, 0, 0, 0).toString());
    });

    it('should transform date into ISO String and store it in parentUserData', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.parentUserData = {};

      // ACT
      vm.parentUserDataDoB = new Date(1980, 7, 27, 0, 0, 0, 0);

      // ASSERT
      expect(vm.parentUserData.dob).to.equal('1980-08-27T00:00:00.000Z');
    });
  });

  describe('created()', () => {
    it('should assign bookedTickets, and generate user objects for each ticket', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.tickets = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: { id: 'foo' },
            },
            {
              ticket: { id: 'foo' },
            },
          ],
        },
        bar: {
          session: 'foo',
          selectedTickets: [
            {
              ticket: { id: 'bar' },
            },
          ],
        },
      };

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.bookedTickets).to.deep.equal({
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
              },
              user: { dob: {} },
            },
            {
              ticket: {
                id: 'foo',
              },
              user: { dob: {} },
            },
          ],
        },
        bar: {
          session: 'foo',
          selectedTickets: [
            {
              ticket: {
                id: 'bar',
              },
              user: { dob: {} },
            },
          ],
        },
      });
    });
  });
});
