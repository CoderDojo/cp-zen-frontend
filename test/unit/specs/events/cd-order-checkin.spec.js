import vueUnitHelper from 'vue-unit-helper';
import orderCheckin from '!!vue-loader?inject!@/events/cd-order-checkin';

describe('Order checkin component', () => {
  let sandbox;
  let OrderCheckinWithMocks;
  let MockEventsService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventsService = {
      v3: {
        checkin: sandbox.stub(),
      },
    };
    OrderCheckinWithMocks = orderCheckin({
      '@/events/service': MockEventsService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('isVerified', () => {
      it('should return true if all applications are approved', () => {
        const vm = vueUnitHelper(OrderCheckinWithMocks);
        vm.order = {
          applications: [{
            status: 'approved',
          }, {
            status: 'approved',
          }],
        };
        expect(vm.isVerified).to.be.true;
      });
      it('should return false if any application is not approved', () => {
        const vm = vueUnitHelper(OrderCheckinWithMocks);
        vm.order = {
          applications: [{
            status: 'approved',
          }, {
            status: 'pending',
          }],
        };
        expect(vm.isVerified).to.be.false;
      });
    });
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('should checkin the order from the params', async () => {
        // ARRANGE
        const vm = vueUnitHelper(OrderCheckinWithMocks);
        vm.isVerified = true;
        vm.$route = {
          params: {
            eventId: 'event1',
            orderId: 'order1',
          },
        };
        MockEventsService.v3.checkin.resolves({ body: { id: 'order1' } });
        // ACT
        await vm.$lifecycleMethods.created();

        // ASSERT
        expect(MockEventsService.v3.checkin).to.have.been.calledOnce
          .and.calledWith('event1', 'order1');
        expect(vm.ready).to.be.true;
      });
    });
  });
});
