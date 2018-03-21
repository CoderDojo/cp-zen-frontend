import vueUnitHelper from 'vue-unit-helper';
import BookingParentFormComponent from '!!vue-loader?inject!@/events/cd-booking-parent-form';

describe('Booking Parent Form', () => {
  let sandbox;
  let MockStoreService;
  let BookingParentFormComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.stub(),
      load: sandbox.stub(),
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

  describe('validateForm()', () => {
    it('should return true when form is valid', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.$validator = {
        validateAll: () => true,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(true);
    });

    it('should return false when form is invalid', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.$validator = {
        validateAll: () => false,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });

    it('should return false when validateAll throws an error', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.$validator = {
        validateAll: () => {
          throw new Error('Invalid form');
        },
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });
  });

  describe('prefillDateOfBirth()', () => {
    it('should set applicantDob and parentUserData.dob from the store', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      MockStoreService.load.withArgs('applicant-dob').returns('1980-04-22T00:00:00.000Z');

      // ACT
      vm.prefillDateOfBirth();

      // ASSERT
      expect(vm.applicantDob.toString()).to.equal(new Date('1980-04-22T00:00:00.000Z').toString());
      expect(vm.parentUserData.dob.toString()).to.equal(new Date('1980-04-22T00:00:00.000Z').toString());
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
      sandbox.stub(vm, 'prefillDateOfBirth');

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
                notes: 'N/A',
              },
              user: { dob: null },
            },
            {
              ticket: {
                id: 'foo',
                notes: 'N/A',
              },
              user: { dob: null },
            },
          ],
        },
        bar: {
          session: 'foo',
          selectedTickets: [
            {
              ticket: {
                id: 'bar',
                notes: 'N/A',
              },
              user: { dob: null },
            },
          ],
        },
      });
      expect(vm.prefillDateOfBirth).to.have.been.calledOnce;
    });
  });
});
