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

  it('should store the selected tickets using the storage service', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {};

    // ACT
    vm.onTicketQuantityUpdate('xyz', 1);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({
      xyz: 1,
    });

    expect(MockStoreService.load).to.have.been.calledWith('booking-sessions');
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', {
      abc: {
        xyz: 1,
      },
    });
  });

  it('should add to selected tickets', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {
      def: 1,
    };

    // ACT
    vm.onTicketQuantityUpdate('xyz', 1);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({
      def: 1,
      xyz: 1,
    });
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', {
      abc: {
        def: 1,
        xyz: 1,
      },
    });
  });

  it('should update selected tickets when value changed', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {
      def: 1,
    };

    // ACT
    vm.onTicketQuantityUpdate('def', 2);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({
      def: 2,
    });
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', {
      abc: {
        def: 2,
      },
    });
  });

  it('should remove selected tickets when value is zero', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {
      def: 1,
    };

    // ACT
    vm.onTicketQuantityUpdate('def', 0);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({});
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', { abc: {} });
  });

  it('should retain other selected tickets when one ticket is removed', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {
      def: 1,
      xyz: 1,
    };

    // ACT
    vm.onTicketQuantityUpdate('def', 0);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({
      xyz: 1,
    });
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', {
      abc: {
        xyz: 1,
      },
    });
  });

  it('should store the selected tickets without changing other sessions tickets amount', () => {
    // ARRANGE
    const vm = vueUnitHelper(EventTicketsWithMocks);
    vm.sessionId = 'abc';
    vm.selectedTickets = {};

    MockStoreService.load.withArgs('booking-sessions').returns({
      foo: {
        bar: 100,
      },
    });

    // ACT
    vm.onTicketQuantityUpdate('xyz', 1);

    // ASSERT
    expect(vm.selectedTickets).to.deep.equal({
      xyz: 1,
    });
    expect(MockStoreService.load).to.have.been.calledWith('booking-sessions');
    expect(MockStoreService.save).to.have.been.calledWith('booking-sessions', {
      foo: {
        bar: 100,
      },
      abc: {
        xyz: 1,
      },
    });
  });
});
