import vueUnitHelper from 'vue-unit-helper';
import EventDetails from '!!vue-loader?inject!@/events/cd-event-details';

describe('Event details', () => {
  const sandbox = sinon.sandbox.create();
  const MockEventService = {
    loadEvent: sandbox.stub(),
  };
  const EventDetailsWithMocks = EventDetails({
    './service': MockEventService,
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
});
