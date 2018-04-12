import vueUnitHelper from 'vue-unit-helper';
import ChildTicket from '!!vue-loader?inject!@/events/cd-event-add-child-ticket';

describe('Add Child Ticket', () => {
  let sandbox;
  let MockVueDobPicker;
  let MockVueMultiselect;
  let ChildTicketWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockVueDobPicker = {
      dob: sandbox.stub(),
    };
    MockVueMultiselect = {
      ticketSelect: sandbox.stub(),
    };
    ChildTicketWithMocks = ChildTicket({
      'vue-dob-picker': MockVueDobPicker,
      'vue-multiselect': MockVueMultiselect,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods', () => {
    describe('methods.showWhy()', () => {
      it('should change the value of whyGender to true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.whyGender = false;

        // ACT
        await vm.showWhy();

        // ASSERT
        expect(vm.whyGender).to.equal(true);
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
  });

  describe('computed', () => {
    describe('computed.childTickets', () => {
      it('should filter out only child tickets from each sessions tickets', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.sessions = [{ description: 'description1',
          entity: 'sessionentity',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              entity: 'ticketentity',
              id: 'ticketId1',
              invites: null,
              name: 'Ticket1',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'parent-guardian' },
            { approvedApplications: 0,
              deleted: 0,
              entity: 'ticketentity',
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2',
              quantity: 1,
              sessionId: 'sessionId',
              totalApplications: 0,
              type: 'ninja' }],
        }];

        // ACT

        // ASSERT
        expect(vm.childTickets).to.deep.equal([{ description: 'description1',
          entity: 'sessionentity',
          eventId: 'some-eventId',
          id: 'sessionId',
          name: 'Session1',
          status: 'status1',
          tickets: [
            { approvedApplications: 0,
              deleted: 0,
              entity: 'ticketentity',
              id: 'ticketId2',
              invites: null,
              name: 'Ticket2',
              quantity: 1,
              sessionId: 'sessionId',
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

    describe('computed.status', () => {
      it('should return a status of pending if the event ticketApproval is set to true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.event = { ticketApproval: true };

        // ACT

        // ASSERT
        expect(vm.status).to.equal('pending');
      });

      it('should return a status of approved if the event ticketApproval is set to false', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.event = { ticketApproval: false };

        // ACT

        // ASSERT
        expect(vm.status).to.equal('approved');
      });
    });

    describe('computed.applications', () => {
      it('should return full application when form is filled out', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.name = 'Jane Doe';
        vm.dob = new Date(1980, 10, 25, 0, 0, 0, 0);
        vm.eventId = 'eventId';
        vm.status = 'pending';
        vm.tickets = [{
          approvedApplications: 0,
          deleted: 0,
          entity: 'ticketentity',
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
          created: new Date(),
          date_of_birth: new Date(1980, 10, 25, 0, 0, 0, 0),
          dojo_id: 'dojoId',
          event_id: 'eventId',
          name: 'Jane Doe',
          session_id: 'sessionId',
          status: 'pending',
          ticket_id: 'ticketId2',
          ticket_name: 'Ticket2',
          ticket_type: 'ninja',
        }]);
      });
    });
  });
});
