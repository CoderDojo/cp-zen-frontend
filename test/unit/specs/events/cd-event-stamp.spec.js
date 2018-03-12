import vueUnitHelper from 'vue-unit-helper';
import EventStamp from '!!vue-loader?inject!@/events/cd-event-stamp';
import moment from 'moment';

describe('Event stamp component', () => {
  let sandbox;
  let MockEventService;
  let EventStampWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventService = {
      v3: {
        get: sandbox.stub(),
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('date', () => {
      it('should format the date', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventStamp());
        vm.event = {
          startTime: moment('2018-06-03T10:00:00.000Z'),
        };
        // ACT & ASSERT
        expect(vm.date).to.equal('Sunday, June 3rd');
      });
    });
  });
  describe('created', () => {
    beforeEach(() => {
      EventStampWithMocks = EventStamp({
        './service': MockEventService,
      });
    });
    it('should set vm.event to the next event', async () => {
      // ARRANGE
      const mockEventData = {
        id: 1,
        name: 'event',
      };
      MockEventService.v3.get.resolves({
        body: { results: [mockEventData] },
      });
      const vm = vueUnitHelper(EventStampWithMocks);
      vm.dojo = { id: '111' };
      // ASSERT
      await vm.$lifecycleMethods.created();
      expect(MockEventService.v3.get).to.have.been.calledOnce;
      expect(MockEventService.v3.get).to.have.been.calledWith(
        vm.dojo.id,
        {
          params:
          {
            pageSize: 1,
            query: {
              public: 1,
              status: 'published',
              afterDate: sinon.match.number,
              utcOffset: -0,
            },
          },
        });
      expect(vm.event).to.eql(mockEventData);
    });
    it('vm.event should stay null if there is no event', async () => {
      // ARRANGE
      MockEventService.v3.get.resolves({
        body: [],
      });
      const vm = vueUnitHelper(EventStampWithMocks);
      vm.dojo = { id: '111' };
      // ASSERT
      await vm.$lifecycleMethods.created();
      expect(MockEventService.v3.get).to.have.been.calledOnce;
      expect(MockEventService.v3.get).to.have.been.calledWith(
        vm.dojo.id,
        {
          params:
          {
            pageSize: 1,
            query: {
              public: 1,
              status: 'published',
              afterDate: sinon.match.number,
              utcOffset: -0,
            },
          },
        });
      expect(vm.event).to.be.null;
    });
  });
});
