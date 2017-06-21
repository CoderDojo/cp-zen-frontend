import vueUnitHelper from 'vue-unit-helper';
import { extend } from 'lodash';
import EventDobVerification from '!!vue-loader?inject!@/events/cd-event-dob-verification';

describe('Event DOB verification', () => {
  let vm;
  let sandbox;
  let MockEventService;
  let MockStoreService;
  let EventDobVerificationWithMocks;
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
    EventDobVerificationWithMocks = EventDobVerification({
      './service': MockEventService,
      '@/store/store-service': MockStoreService,
    });
    vm = vueUnitHelper(EventDobVerificationWithMocks);
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
      date: new Date(1980, 10, 25, 0, 0, 0, 0),
    };

    vm.next.bind(data)();
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(data.$router.push).to.be.calledOnce;
    expect(data.$router.push).to.have.been.calledWith(`/events/${data.eventId}/sessions`);
  });

  it('should allow adults', () => {
    const now = new Date(1980, 10, 25, 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: now,
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
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: turned13,
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
    const under13 = new Date(now.getFullYear() - 11, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: under13,
      isDobUnderage: false,
    };

    extend(vm, data);

    vm.next();
    expect(vm.isDobUnderage).to.equal(true);
    expect(MockStoreService.save).not.to.be.called;

    expect(vm.$router.push).not.to.be.called;
  });
});
