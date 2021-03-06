import vueUnitHelper from 'vue-unit-helper';
import EventTicket from '!!vue-loader?inject!@/events/order/cd-event-ticket';

describe('Event ticket creation', () => {
  let EventTicketWithMocks;

  beforeEach(() => {
    EventTicketWithMocks = EventTicket({
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('computed: isNinja', () => {
    it('should return true', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.user = {
        dob: new Date(),
      };
      vm.user.dob.setFullYear((new Date()).getFullYear() - 2);
      expect(vm.isNinja).to.equal(true);
    });
    it('should return true', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.user = {
        dob: new Date(),
      };
      vm.user.dob.setFullYear((new Date()).getFullYear() - 25);
      expect(vm.isNinja).to.equal(false);
    });
  });
  describe('computed: ticketsOptions', () => {
    it('should return an array of sessions provided an event', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.event = {
        sessions: [{
          description: 'desc',
          eventId: 'id',
          id: 'sessionId',
          status: 'active',
          name: 'session1',
          tickets: [],
        }],
      };
      expect(vm.ticketsOptions[0]).to.deep.equal({
        description: 'desc',
        eventId: 'id',
        id: 'sessionId',
        name: 'session1',
        status: 'active',
        tickets: [],
      });
    });
    it('should filter the tickets', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.filterByTicketType = sinon.stub().returns(false);
      vm.event = {
        sessions: [{
          description: 'desc',
          eventId: 'id',
          id: 'sessionId',
          name: 'session1',
          status: 'active',
          tickets: [{
            type: 'ninja',
          }],
        }],
      };
      expect(vm.ticketsOptions[0]).to.deep.equal({
        description: 'desc',
        eventId: 'id',
        id: 'sessionId',
        name: 'session1',
        status: 'active',
        tickets: [],
      });
      expect(vm.filterByTicketType).to.have.been.calledWith('ninja');
    });
    it('should set if the ticket is disabled', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.$t = sinon.stub().returnsArg(0);
      vm.filterByTicketType = sinon.stub().returns(true);
      vm.ticketIsFull = sinon.stub().returns(true);
      vm.event = {
        sessions: [{
          description: 'desc',
          eventId: 'id',
          id: 'sessionId',
          name: 'session1',
          status: 'active',
          tickets: [{
            name: 'ninjaTicket',
            type: 'ninja',
          }],
        }],
      };
      expect(vm.ticketsOptions[0]).to.deep.equal({
        description: 'desc',
        eventId: 'id',
        id: 'sessionId',
        name: 'session1',
        status: 'active',
        tickets: [{
          name: 'ninjaTicket [ this ticket is fully booked ]',
          type: 'ninja',
          $isDisabled: true,
        }],
      });
      expect(vm.filterByTicketType).to.have.been.calledWith('ninja');
    });
  });
  describe('computed: applications', () => {
    it('should format the user\'s tickets', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.event = {
        id: 'eventId',
        dojoId: 'dojoId',
      };
      vm.user = {
        name: 'first last',
        userId: 'userId',
        dob: '2014-08-08',
      };
      vm.selectedTickets = [{
        name: 'ticketName',
        type: 'ticketType',
        sessionId: 'sessionId',
        id: 'ticketId',
      }];
      expect(vm.applications).to.deep.equal([{
        name: 'first last',
        dateOfBirth: '2014-08-08',
        eventId: 'eventId',
        ticketName: 'ticketName',
        ticketType: 'ticketType',
        sessionId: 'sessionId',
        dojoId: 'dojoId',
        ticketId: 'ticketId',
        userId: 'userId',
      }]);
    });
    it('should format the user\'s tickets WITH a specialRequirement', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.event = {
        id: 'eventId',
        dojoId: 'dojoId',
      };
      vm.user = {
        name: 'first last',
        userId: 'userId',
        dob: '2014-08-08',
      };
      vm.selectedTickets = [{
        name: 'ticketName',
        type: 'ticketType',
        sessionId: 'sessionId',
        id: 'ticketId',
      }];
      vm.notes = 'Need wheelchair access';

      expect(vm.applications[0]).to.deep.equal({
        name: 'first last',
        dateOfBirth: '2014-08-08',
        eventId: 'eventId',
        ticketName: 'ticketName',
        ticketType: 'ticketType',
        sessionId: 'sessionId',
        notes: 'Need wheelchair access',
        dojoId: 'dojoId',
        ticketId: 'ticketId',
        userId: 'userId',
      });
    });
  });
  describe('methods: filterByTicketType', () => {
    it('should return true if the type("ninja") is included and the user is a ninja', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.isNinja = true;
      expect(vm.filterByTicketType('ninja')).to.be.true;
    });
    it('should return true if the type("others") is included and the user is a ninja', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.isNinja = true;
      expect(vm.filterByTicketType('others')).to.be.true;
    });
    it('should return false if the type("mentor") is not included and the user is a ninja', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.isNinja = true;
      expect(vm.filterByTicketType('mentor')).to.be.false;
    });
    it('should return true if the type("mentor") is included and the user is a mentor', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.user = {
        dob: new Date().setFullYear((new Date()).getFullYear() - 25),
      };
      vm.isNinja = false;
      expect(vm.filterByTicketType('mentor')).to.be.true;
    });
  });
  describe('methods: findTicketOption', () => {
    it('should find a ticket from its id', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      const application = { sessionId: 'session1', ticketId: 'ticket1' };
      vm.ticketsOptions = [
        {
          id: 'session1', tickets: [{ id: 'ticket1' }, { id: 'ticket2' }],
        },
        {
          id: 'session2', tickets: [{ id: 'ticket3' }],
        }];
      const res = vm.findTicketOption(application);
      expect(res).to.deep.equal({ id: 'ticket1' });
    });
  });
  describe('lifecycle: created', () => {
    it('should transform the existingApplications into selected tickets', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.findTicketOption = sinon.stub().returnsArg(0);
      vm.existingApplications = [{ ticketId: 'ticket1' }, { ticketId: 'ticket2' }];

      vm.$lifecycleMethods.created();
      expect(vm.findTicketOption).to.have.been.calledTwice;
      expect(vm.selectedTickets).to.deep.equal(vm.existingApplications);
    });
    it('should not transform the applications if there aren\'t any', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.findTicketOption = sinon.stub().returnsArg(0);
      vm.existingApplications = undefined;

      vm.$lifecycleMethods.created();
      expect(vm.findTicketOption).to.not.have.been.called;
    });
  });
});
