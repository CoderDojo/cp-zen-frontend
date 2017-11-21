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
  const mockDob = new Date(1980, 10, 25, 0, 0, 0, 0);

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

  it('should save selected event and dob and go to next page', async () => {
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: mockDob,
      eventId: 'foo',
      $validator: {
        validateAll: sandbox.stub().returns(Promise.resolve(undefined)),
      },
    };

    await vm.next.bind(data)();
    expect(data.$validator.validateAll).to.have.been.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);
    expect(MockStoreService.save).to.have.been.calledWith('applicant-dob', mockDob);
    expect(MockStoreService.save).to.be.calledTwice;

    expect(data.$router.push).to.be.calledOnce;
    expect(data.$router.push).to.have.been.calledWith({ name: 'EventSessions', params: { eventId: data.eventId } });
  });

  it('should not continue on falsy date', async () => {
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: undefined,
      isDobUnderage: false,
      $validator: {
        validateAll: sinon.stub().returns(Promise.reject(new Error('Err'))),
      },
    };

    extend(vm, data);

    await vm.next();
    expect(data.$validator.validateAll).to.have.been.calledOnce;
    expect(MockStoreService.save).to.not.have.been.called;
    expect(vm.$router.push).to.not.have.been.called;
  });

  it('should allow adults', async () => {
    const mockDate = new Date(1980, 10, 25, 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: mockDate,
      isDobUnderage: false,
      $validator: {
        validateAll: sinon.stub().returns(Promise.resolve(undefined)),
      },
    };

    extend(vm, data);

    await vm.next();
    expect(vm.isDobUnderage).to.equal(false);
    expect(data.$validator.validateAll).to.have.been.calledOnce;
    expect(MockStoreService.save).to.be.calledTwice;
    expect(MockStoreService.save).to.have.been.calledWith('applicant-dob', mockDate);
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(vm.$router.push).to.be.calledOnce;
    expect(vm.$router.push).to.have.been.calledWith({ name: 'EventSessions', params: { eventId: vm.eventId } });
  });

  it('should allow someone who just turned 13', async () => {
    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: turned13,
      isDobUnderage: false,
      $validator: {
        validateAll: sandbox.stub().returns(Promise.resolve(undefined)),
      },
    };

    extend(vm, data);

    await vm.next();
    expect(vm.isDobUnderage).to.equal(false);
    expect(MockStoreService.save).to.be.calledTwice;
    expect(MockStoreService.save).to.have.been.calledWith('applicant-dob', turned13);
    expect(MockStoreService.save).to.have.been.calledWith('selected-event', mockEventData);

    expect(vm.$router.push).to.be.calledOnce;
    expect(vm.$router.push).to.have.been.calledWith({ name: 'EventSessions', params: { eventId: vm.eventId } });
  });

  it('should not allow someone who is under 13', async () => {
    const now = new Date();
    const under13 = new Date(now.getFullYear() - 11, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const data = {
      $router: {
        push: sandbox.spy(),
      },
      eventDetails: mockEventData,
      date: under13,
      isDobUnderage: false,
      $validator: {
        validateAll: sandbox.stub().returns(Promise.resolve(undefined)),
      },
    };

    extend(vm, data);

    await vm.next();
    expect(vm.isDobUnderage).to.equal(true);
    expect(MockStoreService.save).not.to.be.called;

    expect(vm.$router.push).not.to.be.called;
  });
});
