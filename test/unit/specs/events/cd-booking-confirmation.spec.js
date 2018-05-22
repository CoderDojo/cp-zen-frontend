import vueUnitHelper from 'vue-unit-helper';
import BookingConfirmationComponent from '!!vue-loader?inject!@/events/cd-booking-confirmation';

describe('Booking Confirmation Component', () => {
  let sandbox;
  let MockDojoService;
  let MockUserService;
  let MockEventService;
  let BookingConfirmationComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojoService = {
      getDojoById: sandbox.stub(),
    };
    MockEventService = {
      loadEvent: sandbox.stub(),
      loadSessions: sandbox.stub(),
      v3: {
        getOrder: sandbox.stub(),
      },
    };
    MockUserService = {
      getCurrentUser: sandbox.stub(),
    };
    BookingConfirmationComponentWithMocks = BookingConfirmationComponent({
      '@/dojos/service': MockDojoService,
      '@/users/service': MockUserService,
      '@/events/service': MockEventService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods.loadData()', () => {
    it('should load create user and booking data from the store', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      MockDojoService.getDojoById.resolves({ body: {} });
      MockEventService.loadEvent.resolves({ body: {} });
      MockEventService.loadSessions.resolves({ body: {} });
      MockEventService.v3.getOrder.resolves({ body: { results: [] } });
      MockUserService.getCurrentUser.resolves({ body: { user: {} } });

      // ACT
      await vm.loadData();

      // ASSERT
      expect(MockDojoService.getDojoById).to.have.been.calledOnce;
      expect(MockUserService.getCurrentUser).to.have.been.calledOnce;
      expect(MockEventService.loadEvent).to.have.been.calledOnce;
      expect(MockEventService.loadSessions).to.have.been.calledOnce;
      expect(MockEventService.v3.getOrder).to.have.been.calledOnce;
    });
  });

  describe('methods.getSessionName', () => {
    it('should get the session name for the session.id', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      const sessionId = '1';
      vm.sessions = [{
        id: '1',
        name: 'banana',
      }];

      // ACT
      const sessionName = vm.getSessionName(sessionId);

      // ASSERT
      expect(sessionName).to.equal('banana');
    });
  });
  describe('computed', () => {
    describe('computed.title', () => {
      it('should return the proper title when the event requires ticket approval', () => {
        const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
        vm.$t = sinon.stub().returnsArg(0);
        vm.event = {
          ticketApproval: true,
        };
        expect(vm.title).to.equal('Booking Request Sent');
      });
      it('should return the proper title when the event doesnt require ticket approval', () => {
        const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
        vm.$t = sinon.stub().returnsArg(0);
        vm.event = {
          ticketApproval: false,
        };
        expect(vm.title).to.equal('Booking Complete');
      });
    });
    describe('computed.subtitle', () => {
      it('should return the proper subtitle when the event requires ticket approval', () => {
        const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
        vm.$t = sinon.stub().returnsArg(0);
        vm.event = {
          ticketApproval: true,
        };
        expect(vm.subtitle).to.equal('You will be notified when the organizer approves your request.');
      });
      it('should return the proper subtitle when the event doesnt require ticket approval', () => {
        const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
        vm.$t = sinon.stub().returnsArg(0);
        vm.event = {
          ticketApproval: false,
          user: {
            email: 'doo@do.do',
          },
        };
        expect(vm.subtitle).to.equal('A confirmation email has been sent to {email}', { email: '<strong>doo@do.do</strong>' });
      });
    });
  });

  describe('created()', () => {
    it('should load booking data', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
      sandbox.stub(vm, 'loadData');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadData).to.have.been.calledOnce;
    });
  });
});
