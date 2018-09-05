import vueUnitHelper from 'vue-unit-helper';
import DashboardProjectsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-projects';

describe('Dashboard children component', () => {
  let sandbox;
  let DashboardProjectsComponentWithMocks;
  let MockProjectsService;
  let vm;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockProjectsService = {
      list: sandbox.stub(),
    };
    DashboardProjectsComponentWithMocks = DashboardProjectsComponent({
      '@/projects/service': MockProjectsService,
    });
    vm = vueUnitHelper(DashboardProjectsComponentWithMocks);
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('computed', () => {
    describe('isDisplayable', () => {
      it('should return true if projects is not null', () => {
        // ARRANGE
        vm.projects = [{ id: '1' }];

        // ASSERT
        expect(vm.isDisplayable).to.deep.equal(true);
      });

      it('should return false if projects is null', () => {
        // ARRANGE
        vm.projects = null;

        // ASSERT
        expect(vm.isDisplayable).to.deep.equal(false);
      });
    });
  });

  describe('methods', () => {
    describe('loadProjects', () => {
      it('should load the latest projects and keep only the first three', async () => {
        // ARRANGE
        const mockProjects = {
          data: [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        };
        MockProjectsService.list.resolves({ body: mockProjects });
        // ACT
        await vm.loadProjects();

        // ASSERT
        expect(vm.projects).to.deep.equal([
          { id: '1' },
          { id: '2' },
          { id: '3' },
        ]);
      });
    });
  });

  describe('created', () => {
    it('should call loadProjects', async () => {
      // ARRANGE
      sandbox.stub(vm, 'loadProjects');

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadProjects).to.have.been.calledOnce;
    });
  });
});
