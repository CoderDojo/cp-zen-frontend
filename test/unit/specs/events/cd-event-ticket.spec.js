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
      vm.user = {
        dob: new Date().setFullYear((new Date()).getFullYear() - 2),
      };
      expect(vm.isNinja).to.equal(true);
    });
    it('should return true', () => {
      const vm = vueUnitHelper(EventTicketWithMocks);
      vm.user = {
        dob: new Date().setFullYear((new Date()).getFullYear() - 25),
      };
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
      expect(vm.ticketsOptions[1]).to.deep.equal({
        name: 'No Ticket',
        tickets: [{ name: 'Not Attending', type: 'noTicket' }],
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
      expect(vm.ticketsOptions[1]).to.deep.equal({
        name: 'No Ticket',
        tickets: [{ name: 'Not Attending', type: 'noTicket' }],
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
      vm.tickets = [{
        name: 'ticketName',
        type: 'ticketType',
        sessionId: 'sessionId',
        id: 'ticketId',
      },
      {
        name: 'Not Attending',
        type: 'noTicket',
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
    it('should return an empty applications array', () => {
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
      vm.tickets = [{
        name: 'Not Attending',
        type: 'noTicket',
      }];
      expect(vm.applications).to.deep.equal([]);
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
      vm.tickets = [{
        name: 'ticketName',
        type: 'ticketType',
        sessionId: 'sessionId',
        id: 'ticketId',
      }];
      vm.specialRequirement = 'Need wheelchair access';

      expect(vm.applications[0]).to.deep.equal({
        name: 'first last',
        dateOfBirth: '2014-08-08',
        eventId: 'eventId',
        ticketName: 'ticketName',
        ticketType: 'ticketType',
        sessionId: 'sessionId',
        specialRequirement: 'Need wheelchair access',
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
});
