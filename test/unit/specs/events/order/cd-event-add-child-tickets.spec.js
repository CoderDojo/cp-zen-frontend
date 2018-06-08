import vueUnitHelper from 'vue-unit-helper';
import { clone } from 'lodash';
import ChildTicket from '!!vue-loader?inject!@/events/order/cd-event-add-child-ticket';

describe('Add Child Ticket', () => {
  let sandbox;
  let MockVueDobPicker;
  let MockVueMultiselect;
  let MockUserUtils;
  let MockUsersService;
  let OrderStore;
  let ChildTicketWithMocks;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
    sandbox = sinon.sandbox.create();
    MockVueDobPicker = {
      dob: sandbox.stub(),
    };
    MockVueMultiselect = {
      ticketSelect: sandbox.stub(),
    };
    MockUserUtils = {
      isUnderAge: sandbox.stub(),
      profileToJSON: sandbox.stub(),
    };
    MockUsersService = {
      addChild: sandbox.stub(),
    };
    OrderStore = {
      getters: {},
      commit: sandbox.stub(),
    };
    ChildTicketWithMocks = ChildTicket({
      'vue-dob-picker': MockVueDobPicker,
      'vue-multiselect': MockVueMultiselect,
      '@/users/util': MockUserUtils,
      '@/users/service': MockUsersService,
      '@/events/order/order-store': OrderStore,
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('methods', () => {
    describe('methods.showWhy()', () => {
      it('should change the value of genderExplaination to true', () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.genderExplaination = false;

        // ACT
        vm.showWhy();

        // ASSERT
        expect(vm.genderExplaination).to.equal(true);
      });
    });

    describe('methods.onBlur()', () => {
      it('should emit a blur event after 50ms and assign the timeout to blurTimeout', () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        sandbox.stub(window, 'setTimeout').callsFake((cb) => {
          cb();
          return 'foo';
        });
        const emitStub = sandbox.stub();
        vm.$emit = emitStub;

        // ACT
        vm.onBlur();

        // ASSERT
        expect(window.setTimeout).to.have.been.calledOnce;
        expect(window.setTimeout).to.have.been.calledWith(sinon.match.func, 50);
        expect(vm.$emit).to.have.been.calledOnce;
        expect(vm.$emit).to.have.been.calledWith('blur');
        expect(vm.blurTimeout).to.equal('foo');
      });
    });

    describe('methods.onFocus()', () => {
      it('should clear any existing blur timeout', () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        sandbox.stub(window, 'clearTimeout');
        vm.blurTimeout = 'foo';

        // ACT
        vm.onFocus();

        // ASSERT
        expect(window.clearTimeout).to.have.been.calledOnce;
        expect(window.clearTimeout).to.have.been.calledWith('foo');
      });
    });

    describe('methods.createChild()', () => {
      it('should create a new child profile with the computed child object and change/set the userId with the id of the reponse', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        const childIdCounter = 1;
        vm.child = {
          name: 'John Doe',
          dob: new Date(2010, 0, 1, 0, 0, 0, 0),
          gender: 'male',
          userTypes: ['attendee-u13'],
        };
        MockUserUtils.profileToJSON.callsFake(child => child);
        MockUsersService.addChild.callsFake((child) => {
          const childClone = clone(child);
          childClone.id = childIdCounter;
          childClone.userId = 1000 + childIdCounter;
          return Promise.resolve({ body: childClone });
        });
        // ACT
        await vm.createChild();

        // ASSERT
        expect(MockUsersService.addChild.getCall(0).args[0]).to.deep.equal({
          name: 'John Doe',
          dob: new Date(2010, 0, 1, 0, 0, 0, 0),
          gender: 'male',
          userTypes: ['attendee-u13'],
        });
        expect(vm.userId).to.equal(1001);
      });
    });
  });

  describe('destroyed', () => {
    it('should remove the application when the component is destroyed', () => {
      const vm = vueUnitHelper(ChildTicketWithMocks);
      vm.id = 'user1';
      vm.$lifecycleMethods.destroyed();
      expect(OrderStore.commit).to.have.been.calledWith('removeApplications', vm.id);
    });
  });
  describe('watch', () => {
    describe('watch.applications()', () => {
      it('should emit an "input" event with the entering of application details', () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        const mockApplication = {
          date_of_birth: new Date(1980, 10, 25, 0, 0, 0, 0),
          dojo_id: 'dojoId',
          event_id: 'eventId',
          name: 'Jane Doe',
          session_id: 'sessionId',
          ticket_id: 'ticketId2',
          ticket_name: 'Ticket2',
          ticket_type: 'ninja',
        };
        vm.id = 'application1';
        vm.applications = mockApplication;

        // ACT
        vm.$watchers.applications();

        // ASSERT
        expect(OrderStore.commit).to.have.been.calledWith('setApplications', { id: vm.id, applications: vm.applications });
      });
    });
  });

  describe('computed', () => {
    describe('computed.childTickets', () => {
      it('should filter out only child tickets from each sessions tickets', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketIsFull = sandbox.stub().returns(false);
        OrderStore.getters.applications = [];
        vm.sessions = [{ description: 'description1',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId1',
              invites: null,
              name: 'Ticket1',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'parent-guardian' },
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'ninja' }],
        }];

        // ASSERT
        expect(vm.childTickets).to.deep.equal([{ description: 'description1',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2',
              quantity: 1,
              sessionId: 'sessionId',
              $isDisabled: false,
              totalApplications: 0,
              type: 'ninja' }],
        }]);
      });
      it('should set the ticket as disabled', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketIsFull = sandbox.stub().returns(true);
        vm.$t = sandbox.stub().returnsArg(0);
        OrderStore.getters.applications = [];
        vm.sessions = [{ description: 'description1',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId1',
              invites: null,
              name: 'Ticket1',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'parent-guardian' },
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'ninja' }],
        }];

        // ASSERT
        console.log(vm.childTickets);
        expect(vm.childTickets).to.deep.equal([{ description: 'description1',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2 [Fully booked]',
              quantity: 1,
              sessionId: 'sessionId',
              $isDisabled: true,
              totalApplications: 0,
              type: 'ninja' }],
        }]);
      });
    });

    describe('computed.name', () => {
      it('should return the full name - firstName and surname contactenated', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.firstName = 'Jane';
        vm.surname = 'Doe';

        // ACT

        // ASSERT
        expect(vm.name).to.equal('Jane Doe');
      });
    });

    describe('computed.applications', () => {
      it('should return full application when form is filled out', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.name = 'Jane Doe';
        vm.dob = new Date(1980, 10, 25, 0, 0, 0, 0);
        vm.eventId = 'eventId';
        vm.userId = null;
        vm.selectedTickets = [{
          approvedApplications: 0,
          deleted: 0,
          id: 'ticketId2',
          invites: null,
          name: 'Ticket2',
          quantity: 1,
          sessionId: 'sessionId',
          totalApplications: 0,
          type: 'ninja' }];
        vm.event = { dojoId: 'dojoId' };

        // ACT

        // ASSERT
        expect(vm.applications).to.deep.equal([{
          dateOfBirth: new Date(1980, 10, 25, 0, 0, 0, 0),
          dojoId: 'dojoId',
          eventId: 'eventId',
          name: 'Jane Doe',
          sessionId: 'sessionId',
          ticketId: 'ticketId2',
          ticketName: 'Ticket2',
          ticketType: 'ninja',
          userId: null,
        }]);
      });

      it('should return full application WITH a specialRequirement when form is filled out', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.specialRequirement = 'Need wheelchair access';
        vm.name = 'Jane Doe';
        vm.dob = new Date(1980, 10, 25, 0, 0, 0, 0);
        vm.eventId = 'eventId';
        vm.userId = null;
        vm.selectedTickets = [{
          approvedApplications: 0,
          deleted: 0,
          id: 'ticketId2',
          invites: null,
          name: 'Ticket2',
          quantity: 1,
          sessionId: 'sessionId',
          totalApplications: 0,
          type: 'ninja' }];
        vm.event = { dojoId: 'dojoId' };

        // ACT

        // ASSERT
        expect(vm.applications).to.deep.equal([{
          dateOfBirth: new Date(1980, 10, 25, 0, 0, 0, 0),
          dojoId: 'dojoId',
          eventId: 'eventId',
          name: 'Jane Doe',
          sessionId: 'sessionId',
          specialRequirement: 'Need wheelchair access',
          ticketId: 'ticketId2',
          ticketName: 'Ticket2',
          ticketType: 'ninja',
          userId: null,
        }]);
      });
    });

    describe('computed.child', () => {
      it('should return child info', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.name = 'Jane Doe';
        vm.firstName = 'Jane';
        vm.surname = 'Doe';
        vm.dob = new Date(2010, 1, 1, 0, 0, 0, 0);
        vm.gender = 'female';
        MockUserUtils.isUnderAge.withArgs(vm.dob).returns(true);
        // ACT

        // ASSERT
        expect(vm.child).to.deep.equal({
          name: 'Jane Doe',
          firstName: 'Jane',
          lastName: 'Doe',
          dob: new Date(2010, 1, 1, 0, 0, 0, 0),
          gender: 'female',
          userTypes: ['attendee-u13'],
        });
      });
    });
  });
});
