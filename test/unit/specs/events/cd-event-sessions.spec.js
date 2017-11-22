import vueUnitHelper from 'vue-unit-helper';
import SessionList from '!!vue-loader?inject!@/events/cd-event-sessions';

describe('Event sessions component', () => {
  const sandbox = sinon.sandbox.create();
  const mockService = {
    loadSessions: sandbox.stub(),
  };
  const MockStoreService = {
    load: sandbox.stub(),
    save: sandbox.stub(),
  };
  const SessionListWithMocks = SessionList({
    './service': mockService,
    '@/store/store-service': MockStoreService,
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods', () => {
    it('quantityBooked: should count the number of booked tickets', () => {
      // ARRANGE
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.eventId = '123';
      vm.submitted = true;
      vm.totalBooked = 0;
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`)
        .returns({ '1a': { selectedTickets: [] } });

      // ACT
      vm.quantityBooked();

      // ASSERT
      expect(MockStoreService.load).to.be.calledTwice;
      expect(vm.totalBooked).to.equal(0);
      expect(vm.submitted).to.be.false;
    });

    it('next: should redirect when at least a ticket is selected', () => {
      // ARRANGE
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.totalBooked = 1;
      vm.eventId = 42;
      vm.$router = {
        push: sandbox.stub(),
      };
      // ACT
      vm.next();

      // ASSERT
      expect(vm.$router.push).to.have.been.calledOnce;
      expect(vm.$router.push).to.have.been.calledWith({ name: 'EventBookingForm', params: { eventId: 42 } });
    });

    it('next: should not redirect when no tickets are selected', () => {
      // ARRANGE
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.totalBooked = 0;
      vm.$router = {
        push: sandbox.stub(),
      };
      // ACT
      vm.next();

      // ASSERT
      expect(vm.$router.push).to.not.have.been.called;
    });
  });

  it('should load the selected event', (done) => {
    // ARRANGE
    const vm = vueUnitHelper(SessionListWithMocks);
    vm.eventId = '123';
    const event = { name: 'Foo event' };
    MockStoreService.load.withArgs('selected-event')
      .returns(event);

    // ACT
    vm.loadEvent();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.event).to.deep.equal(event);
      expect(MockStoreService.load).to.be.calledOnce;
      expect(MockStoreService.save).to.be.calledOnce;
      expect(MockStoreService.save).to.be.calledWith(`booking-${vm.eventId}-sessions`, {});
      done();
    });
  });

  it('should show the list of event sessions', (done) => {
    // ARRANGE
    const mockSessionDataResponse = [
      {
        name: 'Scratch',
        description: 'Beginners welcomes',
      },
      {
        name: 'Arduino',
        description: 'Intermediate',
      },
    ];

    const vm = vueUnitHelper(SessionListWithMocks);
    vm.eventId = '123';
    vm.event = {
      name: 'Scratch',
    };
    mockService.loadSessions.withArgs(vm.eventId)
      .returns(Promise.resolve({ body: mockSessionDataResponse }));

    // ACT
    vm.loadSessions();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.sessions).to.deep.equal(mockSessionDataResponse);
      expect(MockStoreService.save).to.have.been.calledWith('selected-event', {
        name: 'Scratch',
        sessions: mockSessionDataResponse,
      });
      done();
    });
  });
});
