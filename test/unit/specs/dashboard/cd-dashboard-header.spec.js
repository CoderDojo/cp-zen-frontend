import vueUnitHelper from 'vue-unit-helper';
import DashboardHeaderComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-header';

describe('Dashboard header component', () => {
  let vm;
  let MockDojosService;

  beforeEach(() => {
    MockDojosService = {
      lead: {
        list: sinon.stub(),
      },
    };
    vm = vueUnitHelper(DashboardHeaderComponent({
      '@/dojos/service': MockDojosService,
    }));
  });

  afterEach(() => {
    sinon.restore();
  });


  describe('computed', () => {
    describe('hasLeads', () => {
      it('should return false if the user has no leads', () => {
        // ARRANGE
        vm.leads = [];

        // ASSERT
        expect(vm.hasLeads).to.be.false;
      });
      it('should return true if the user has leads', () => {
        // ARRANGE
        vm.leads = [{ id: 'l1' }];

        // ASSERT
        expect(vm.hasLeads).to.be.true;
      });
    });
  });

  describe('methods', () => {
    describe('loadLeads', () => {
      it('should request the leads for a userId', async () => {
        vm.userId = 'u1';
        MockDojosService.lead.list.resolves({ body: [{ id: 'l1' }] });
        await vm.loadLeads();
        // ASSERT
        expect(MockDojosService.lead.list).to.have.been.calledOnce
          .and.calledWith('u1');
        expect(vm.leads).to.eql([{ id: 'l1' }]);
      });
    });
  });
});
