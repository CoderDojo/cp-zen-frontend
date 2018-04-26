import vueUnitHelper from 'vue-unit-helper';
import EventTicket from '!!vue-loader?inject!@/events/cd-event-ticket';

describe('Event ticket creation', () => {
  let sandbox;
  let MockStoreService;
  let MockUsersUtils;
  let EventTicketWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.stub(),
      load: sandbox.stub(),
    };
    EventTicketWithMocks = EventTicket({
      '@/store/store-service': MockStoreService,
      '@/users/util': MockUsersUtils,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed: isNinja', () => {
    it('should return true', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.dob = new Date().setFullYear((new Date()).getFullYear() - 2);
      expect(vm.isNinja).to.equal(true);
    });
    it('should return true', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.dob = new Date().setFullYear((new Date()).getFullYear() - 25);
      expect(vm.isNinja).to.equal(false);
    });
  });
  describe('computed: ticketsOptions', () => {
    it('should return an array of sessions provided an event', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.sessions = [{
        description: 'desc',
        eventId: 'id',
        id: 'sessionId',
        status: 'active',
        name: 'session1',
        tickets: [],
      }];
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
      vm.filterByTicketType = sandbox.stub().returns(false);
      vm.sessions = [{
        description: 'desc',
        eventId: 'id',
        id: 'sessionId',
        name: 'session1',
        status: 'active',
        tickets: [{
          type: 'ninja',
        }],
      }];
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
  });
  describe('computed: status', () => {
    it('should return pending when the approval is set', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.event = {
        ticketApproval: true,
      };
      expect(vm.status).to.equal('pending');
    });
    it('should return approved when the approval is not set', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.event = {
        ticketApproval: false,
      };
      expect(vm.status).to.equal('approved');
    });
  });
  describe('computed: applications', () => {
    it('should format the user\'s tickets', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.dob = '2014-08-08';
      vm.status = 'approved';
      vm.event = {
        id: 'eventId',
        dojoId: 'dojoId',
      };
      vm.user = {
        name: 'first last',
        id: 'userId',
      };
      vm.tickets = [{
        name: 'ticketName',
        type: 'ticketType',
        sessionId: 'sessionId',
        id: 'ticketId',
      }];
      expect(vm.applications[0]).to.deep.equal({
        name: 'first last',
        date_of_birth: '2014-08-08',
        event_id: 'eventId',
        status: 'approved',
        ticket_name: 'ticketName',
        ticket_type: 'ticketType',
        session_id: 'sessionId',
        dojo_id: 'dojoId',
        ticket_id: 'ticketId',
        user_id: 'userId',
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
      vm.isNinja = false;
      expect(vm.filterByTicketType('mentor')).to.be.true;
    });
  });
});
