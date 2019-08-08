import vueUnitHelper from 'vue-unit-helper';
import DashboardProjectsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-projects';

describe('Dashboard children component', () => {
  let DashboardProjectsComponentWithMocks;
  let MockProjectsService;
  let MockLocaleService;
  let vm;

  beforeEach(() => {
    MockProjectsService = {
      list: sinon.stub(),
    };
    MockLocaleService = {
      getUserLocale: sinon.stub(),
    };
    DashboardProjectsComponentWithMocks = DashboardProjectsComponent({
      '@/projects/service': MockProjectsService,
      '@/locale/service': MockLocaleService,
    });
    vm = vueUnitHelper(DashboardProjectsComponentWithMocks);
  });

  afterEach(() => {
    sinon.restore();
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
    describe('userLocale', () => {
      it('should return the default valid locale for projects API (en)', () => {
        // ARRANGE
        MockLocaleService.getUserLocale.returns(undefined);

        // EXECUTE
        const res = vm.userLocale;

        // ASSERT
        expect(MockLocaleService.getUserLocale).to.have.been.calledOnce;
        expect(res).to.equal('en');
      });
      it('should return the formatted locale from the cookie', () => {
        // ARRANGE
        MockLocaleService.getUserLocale.returns('"fr_FR"');

        // EXECUTE
        const res = vm.userLocale;

        // ASSERT
        expect(MockLocaleService.getUserLocale).to.have.been.calledOnce;
        expect(res).to.equal('fr-FR');
      });
      it('should return en when cookie locale is en_US', () => {
        // ARRANGE
        MockLocaleService.getUserLocale.returns('"en_US"');

        // EXECUTE
        const res = vm.userLocale;

        // ASSERT
        expect(MockLocaleService.getUserLocale).to.have.been.calledOnce;
        expect(res).to.equal('en');
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
        expect(MockProjectsService.list).to.have.been.calledOnce;
        expect(MockProjectsService.list).to.have.been.calledWith('en');
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
      sinon.stub(vm, 'loadProjects');
      vm.projects = [{}];
      vm.userLocale = 'fr-FR';

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadProjects).to.have.been.calledOnce;
      expect(vm.loadProjects).to.have.been.calledWith('fr-FR');
      expect(vm.locale).to.eq('fr-FR');
    });
    it('should call loadProjects twice when the localized call returned nothing', async () => {
      // ARRANGE
      sinon.stub(vm, 'loadProjects').return;
      vm.projects = undefined;
      vm.userLocale = 'fr-FR';

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.loadProjects).to.have.been.calledTwice;
      expect(vm.loadProjects.getCall(0).args).to.deep.equal(['fr-FR']);
      expect(vm.loadProjects.getCall(1).args).to.deep.equal([]);
      expect(vm.locale).to.eq('en');
    });
  });
});
