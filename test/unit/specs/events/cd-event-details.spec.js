import moment from 'moment';
import vueUnitHelper from 'vue-unit-helper';
import EventDetails from '!!vue-loader?inject!@/events/cd-event-details';

describe('Event Details', () => {
  let vm;
  let sandbox;
  let MockEventService;
  let EventDetailsWithMocks;
  const mockEventData = {
    address: 'CHQ',
    type: 'one-off',
    recurringType: 'weekly',
    dates: [
      {
        startTime: '2017-06-06T16:30:00.000Z',
        endTime: '2017-06-06T18:00:00.000Z',
      },
    ],
  };
  const mockRecurringEventData = {
    address: 'CHQ',
    type: 'recurring',
    recurringType: 'biweekly',
    dates: [
      {
        startTime: '2017-06-03T10:00:00.000Z',
        endTime: '2017-06-03T12:00:00.000Z',
      },
      {
        startTime: '2017-06-17T10:00:00.000Z',
        endTime: '2017-06-17T12:00:00.000Z',
      },
      {
        startTime: '2017-07-01T10:00:00.000Z',
        endTime: '2017-07-01T12:00:00.000Z',
      },
      {
        startTime: '2017-07-15T10:00:00.000Z',
        endTime: '2017-07-15T12:00:00.000Z',
      },
      {
        startTime: '2017-07-29T10:00:00.000Z',
        endTime: '2017-07-29T12:00:00.000Z',
      },
    ],
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventService = {
      loadEvent: sandbox.stub(),
    };
    EventDetailsWithMocks = EventDetails({
      './service': MockEventService,
    });
    vm = vueUnitHelper(EventDetailsWithMocks);
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should display Event details', (done) => {
    // ARRANGE
    vm.eventId = 1;
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

  it('should display recurring Event details', (done) => {
    // ARRANGE
    vm.eventId = 2;
    MockEventService.loadEvent.withArgs(2).returns(Promise.resolve(
      {
        body: mockRecurringEventData,
      },
    ));

    // ACT
    vm.loadEvent();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.eventDetails).to.deep.equal(mockRecurringEventData);
      done();
    });
  });

  describe('isRecurring()', () => {
    it('should return true when event type is recurring', () => {
      // ARRANGE
      vm.eventDetails = mockRecurringEventData;

      // ACT
      const recurring = vm.isRecurring();

      // ASSERT
      expect(recurring).to.be.true;
    });

    it('should return false when event type is not recurring', () => {
      // ARRANGE
      vm.eventDetails = mockEventData;

      // ACT
      const recurring = vm.isRecurring();
      // ASSERT
      expect(recurring).to.be.false;
    });
  });

  describe('buildRecurringFrequencyInfo()', () => {
    it('should return true when event type is recurring', () => {
      // ARRANGE
      vm.eventDetails = mockRecurringEventData;

      // ACT
      const message = vm.buildRecurringFrequencyInfo();

      // ASSERT
      expect(message).to.equal('Biweekly on Saturdays');
    });
  });

  describe('getNextStartTime', () => {
    it('should return the first event startTime date after now', () => {
      // ARRANGE
      vm.eventDetails = mockRecurringEventData;
      vm.now = moment('2017-06-22T00:00:00Z');

      // ACT
      const nextStartTime = vm.getNextStartTime();

      // ASSERT
      expect(nextStartTime).to.deep.equal('2017-07-01T10:00:00.000Z');
    });
  });
});
