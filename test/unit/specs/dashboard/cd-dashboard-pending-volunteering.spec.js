import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment';
import DashboardHeaderComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-pending-volunteering';

describe.only('Dashboard pending volunteering component', () => {
  let sandbox;
  let vm;
  let MockDojosService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojosService = {
      getDojos: sandbox.stub(),
    };
    vm = vueUnitHelper(DashboardHeaderComponent({
      '@/dojos/service': MockDojosService,
    }));
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('computed', () => {
    describe('recentRequestsToJoin', () => {
      it('should filter any requests to join which are 30 days older', () => {
        const oldDay = moment().add(-31, 'days');
        const now = new Date();
        // ARRANGE
        vm.requestsToJoin = [{ id: 'rq1', timestamp: oldDay }, { id: 'rq2', timestamp: now }];

        // ASSERT
        expect(vm.recentRequestsToJoin).to.eql([{ id: 'rq2', timestamp: now }]);
      });
    });
    describe('isRecent', () => {
      it('should return true if there are valid requests to join', () => {
        // ARRANGE
        vm.recentRequestsToJoin = [{ id: 'rq1' }];

        // ASSERT
        expect(vm.isRecent).to.be.true;
      });
      it('should return false if the user has no leads', () => {
        // ARRANGE
        vm.recentRequestsToJoin = [];

        // ASSERT
        expect(vm.isRecent).to.be.false;
      });
    });
  });
});
