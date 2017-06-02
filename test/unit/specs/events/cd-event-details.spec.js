import vueUnitHelper from 'vue-unit-helper';
import { extend } from 'lodash';
import EventDetails from '!!vue-loader?inject!@/events/cd-event-details';

describe('Event details', () => {
  let vm;
  let sandbox;
  let MockEventService;
  let MockStoreService;
  let EventDetailsWithMocks;
  const mockEventData = {
    key: 'val',
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.stub(),
    };
    MockEventService = {
      loadEvent: sandbox.stub(),
    };
    EventDetailsWithMocks = EventDetails({
      './service': MockEventService,
      '@/store/store-service': MockStoreService,
    });
    vm = vueUnitHelper(EventDetailsWithMocks);
    vm.eventId = 1;
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should get the event details for the given eventId', (done) => {
    // ARRANGE
    MockEventService.loadEvent.withArgs(1).returns(Promise.resolve(
      {
        body: mockEventData,
      },
    ));

    // ACT
    vm.loadEvent();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.eventDetails).to.deep.equal(mockEventData);
      done();
    });
  });

  it('should save selected event and go to next page', () => {
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
    };

    vm.next.bind(data)();
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(data.$router.push).to.be.calledOnce;
    expect(data.$router.push).to.have.been.calledWith(`/events/${data.eventId}/sessions`);
  });

  it('should allow adults', () => {
    const now = new Date();
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear() - 28,
      isDobUnderage: false,
    };

    extend(vm, data);

    vm.next();
    expect(vm.isDobUnderage).to.equal(false);
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(vm.$router.push).to.be.calledOnce;
    expect(vm.$router.push).to.have.been.calledWith(`/events/${vm.eventId}/sessions`);
  });

  it('should allow someone who just turned 13', () => {
    const now = new Date();
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear() - 13,
      isDobUnderage: false,
    };

    extend(vm, data);

    vm.next();
    expect(vm.isDobUnderage).to.equal(false);
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(vm.$router.push).to.be.calledOnce;
    expect(vm.$router.push).to.have.been.calledWith(`/events/${vm.eventId}/sessions`);
  });

  it('should not allow someone who is under 13', () => {
    const now = new Date();
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear() - 11,
      isDobUnderage: false,
    };

    extend(vm, data);

    vm.next();
    expect(vm.isDobUnderage).to.equal(true);
    expect(MockStoreService.save).not.to.be.called;

    expect(vm.$router.push).not.to.be.called;
  });
});
