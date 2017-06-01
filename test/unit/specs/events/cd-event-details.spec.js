import vueUnitHelper from 'vue-unit-helper';
import EventDetails from '!!vue-loader?inject!@/events/cd-event-details';

describe('Event details', () => {
  const sandbox = sinon.sandbox.create();
  const MockEventService = {
    loadEvent: sandbox.stub(),
  };
  const MockStoreService = {
    save: sinon.stub(),
  };
  const EventDetailsWithMocks = EventDetails({
    './service': MockEventService,
    '@/store/store-service': MockStoreService,
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the event details for the given eventId', (done) => {
    // ARRANGE
    const mockEventData = {
      key: 'val',
    };
    MockEventService.loadEvent.withArgs(1).returns(Promise.resolve({ body: mockEventData }));

    const vm = vueUnitHelper(EventDetailsWithMocks);
    vm.eventId = 1;

    // ACT
    vm.loadEvent();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.eventDetails).to.deep.equal(mockEventData);
      done();
    });
  });

  it('should save selected event and go to next page', () => {
    const mockEventData = {
      key: 'val',
    };
    const vm = vueUnitHelper(EventDetailsWithMocks);
    vm.eventId = 1;

    const data = {
      $router: {
        push: sinon.spy(),
      },
      eventDetails: mockEventData,
    };

    vm.next.bind(data)();
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(data.$router.push).to.be.calledOnce;
    expect(data.$router.push).to.have.been.calledWith(`/events/${data.eventId}/sessions`);
  });
});
