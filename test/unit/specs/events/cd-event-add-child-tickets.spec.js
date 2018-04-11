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

  describe('methods.onTicketTouch()', () => {
    it('should change the value of ticketTouch to true', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ChildTicketWithMocks);
      vm.ticketTouch = false;

      // ACT
      await vm.onTicketTouch();

      // ASSERT
      expect(vm.ticketTouch).to.equal(true);
    });
  });

  // put test for filter
  describe('filter.addPosession', () => {
    it('should add possesion if a first name is provided', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ChildTicketWithMocks);

      // ASSERT
      expect(vm.addPosession('Jane')).to.equal(' - Jane');
    });
    it('should not possesion if a first name is not provided', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ChildTicketWithMocks);

      // ASSERT
      expect(vm.addPosession('')).to.equal('');
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

    describe('computed.invalidTicket', () => {
      it('should return the true if the ticketTouch is true and if the ticket length is equal to 0', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketTouch = true;
        vm.tickets = [];

        // ACT

        // ASSERT
        expect(vm.invalidTicket).to.equal(true);
      });

      it('should return false if the ticketTouch is true and if the ticket length is not equal to 0', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketTouch = true;
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

        // ACT

        // ASSERT
        expect(vm.invalidTicket).to.equal(false);
      });

      it('should return false if the ticketTouch is false and if the ticket length is equal to 0', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketTouch = false;
        vm.tickets = [];

        // ACT

        // ASSERT
        expect(vm.invalidTicket).to.equal(false);
      });


      it('should return false if the ticketTouch is false and if the ticket length is not equal to 0', async () => {
        // ARRANGE
        const vm = vueUnitHelper(ChildTicketWithMocks);
        vm.ticketTouch = false;
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

        // ACT

        // ASSERT
        expect(vm.invalidTicket).to.equal(false);
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
