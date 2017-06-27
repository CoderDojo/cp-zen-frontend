import vueUnitHelper from 'vue-unit-helper';
import EventTickets from '!!vue-loader?inject!@/events/cd-event-tickets';

describe('Event tickets list', () => {
  let sandbox;
  let MockStoreService;
  let EventTicketsWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.stub(),
      load: sandbox.stub(),
    };
    EventTicketsWithMocks = EventTickets({
      '@/store/store-service': MockStoreService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('onTicketQuantityUpdate()', () => {
    it('should save the selected tickets', () => {
      // ARRANGE
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.eventId = 'foo';
      vm.sessionId = 'abc';
      vm.selectedTickets = {};
      sandbox.stub(vm, 'updateStoredSelectedTickets');
      const mockTicket = { id: 'xyz' };

      // ACT
      vm.onTicketQuantityUpdate(mockTicket, 1);

      // ASSERT
      expect(vm.selectedTickets).to.deep.equal({
        xyz: 1,
      });
      expect(vm.updateStoredSelectedTickets).to.have.been.calledOnce;
      expect(vm.updateStoredSelectedTickets).to.have.been.calledWith(mockTicket, 0);
    });

    it('should add to selected tickets', () => {
      // ARRANGE
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.sessionId = 'abc';
      vm.eventId = 'foo';
      vm.selectedTickets = {
        def: 1,
      };
      sandbox.stub(vm, 'updateStoredSelectedTickets');
      const mockTicket = { id: 'xyz' };

      // ACT
      vm.onTicketQuantityUpdate(mockTicket, 1);

      // ASSERT
      expect(vm.selectedTickets).to.deep.equal({
        def: 1,
        xyz: 1,
      });
      expect(vm.updateStoredSelectedTickets).to.have.been.calledOnce;
      expect(vm.updateStoredSelectedTickets).to.have.been.calledWith(mockTicket, 0);
    });

    it('should update selected tickets when value changed', () => {
      // ARRANGE
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.sessionId = 'abc';
      vm.eventId = 'foo';
      vm.selectedTickets = {
        def: 1,
      };
      sandbox.stub(vm, 'updateStoredSelectedTickets');
      const mockTicket = { id: 'def' };

      // ACT
      vm.onTicketQuantityUpdate(mockTicket, 2);

      // ASSERT
      expect(vm.selectedTickets).to.deep.equal({
        def: 2,
      });
      expect(vm.updateStoredSelectedTickets).to.have.been.calledOnce;
      expect(vm.updateStoredSelectedTickets).to.have.been.calledWith(mockTicket, 1);
    });

    it('should remove selected tickets when value is zero', () => {
      // ARRANGE
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.sessionId = 'abc';
      vm.eventId = 'foo';
      vm.selectedTickets = {
        def: 1,
      };
      sandbox.stub(vm, 'updateStoredSelectedTickets');
      const mockTicket = { id: 'def' };

      // ACT
      vm.onTicketQuantityUpdate(mockTicket, 0);

      // ASSERT
      expect(vm.selectedTickets).to.deep.equal({});
      expect(vm.updateStoredSelectedTickets).to.have.been.calledOnce;
      expect(vm.updateStoredSelectedTickets).to.have.been.calledWith(mockTicket, 1);
    });

    it('should retain other selected tickets when one ticket is removed', () => {
      // ARRANGE
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.sessionId = 'abc';
      vm.eventId = 'foo';
      vm.selectedTickets = {
        def: 1,
        xyz: 1,
      };
      sandbox.stub(vm, 'updateStoredSelectedTickets');
      const mockTicket = { id: 'def' };

      // ACT
      vm.onTicketQuantityUpdate(mockTicket, 0);

      // ASSERT
      expect(vm.selectedTickets).to.deep.equal({
        xyz: 1,
      });
      expect(vm.updateStoredSelectedTickets).to.have.been.calledOnce;
      expect(vm.updateStoredSelectedTickets).to.have.been.calledWith(mockTicket, 1);
    });
  });

  describe('updateStoredSelectedTickets()', () => {
    it('should create the array of stored tickets if it doesnt yet exist', () => {
      // ARRANGE
      const storedTicketsMock = undefined;
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.eventId = 'foo';
      vm.selectedTickets = {
        foo: 1,
      };
      vm.session = 'bar';
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(storedTicketsMock);

      // ACT
      vm.updateStoredSelectedTickets({ id: 'foo' }, 0);

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: { id: 'foo' },
            },
          ],
        },
      });
    });

    it('should add to stored tickets when value is increased', () => {
      // ARRANGE
      const storedTicketsMock = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: { id: 'foo' },
            },
          ],
        },
      };
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.eventId = 'foo';
      vm.selectedTickets = {
        foo: 2,
      };
      vm.session = 'bar';
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(storedTicketsMock);

      // ACT
      vm.updateStoredSelectedTickets({ id: 'foo' }, 1);

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {
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
      });
    });

    it('should remove from stored tickets when value is decreased', () => {
      // ARRANGE
      const storedTicketsMock = {
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
      };
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.eventId = 'foo';
      vm.selectedTickets = {
        foo: 1,
      };
      vm.session = 'bar';
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(storedTicketsMock);

      // ACT
      vm.updateStoredSelectedTickets({ id: 'foo' }, 2);

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: { id: 'foo' },
            },
          ],
        },
      });
    });

    it('should remove from stored tickets when value is decreased', () => {
      // ARRANGE
      const storedTicketsMock = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: { id: 'foo' },
            },
          ],
        },
      };
      const vm = vueUnitHelper(EventTicketsWithMocks);
      vm.eventId = 'foo';
      vm.selectedTickets = {};
      vm.session = 'bar';
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(storedTicketsMock);

      // ACT
      vm.updateStoredSelectedTickets({ id: 'foo' }, 1);

      // ASSERT
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, {});
    });
  });
});
