import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment';
import DashboardHeaderComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-pending-volunteering';

describe('Dashboard pending volunteering component', () => {
  let vm;
  let MockDojosService;

  beforeEach(() => {
    MockDojosService = {
      getDojos: sinon.stub(),
    };
    vm = vueUnitHelper(DashboardHeaderComponent({
      '@/dojos/service': MockDojosService,
    }));
  });

  afterEach(() => {
    sinon.restore();
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
    describe('infoIsDisplayed', () => {
      it('should return true if there are valid requests to join and the user is new', () => {
        // ARRANGE
        vm.recentRequestsToJoin = [{ id: 'rq1' }];
        vm.userIsNew = true;

        // ASSERT
        expect(vm.infoIsDisplayed).to.be.true;
      });
      it('should return false if the user has no leads', () => {
        // ARRANGE
        vm.recentRequestsToJoin = [];
        vm.userIsNew = true;

        // ASSERT
        expect(vm.infoIsDisplayed).to.be.false;
      });
      it('should return false if the user is not new', () => {
        // ARRANGE
        vm.recentRequestsToJoin = [{ id: 'rq1' }];
        vm.userIsNew = false;

        // ASSERT
        expect(vm.infoIsDisplayed).to.be.false;
      });
    });
  });
});
