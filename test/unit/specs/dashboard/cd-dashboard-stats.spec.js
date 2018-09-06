import vueUnitHelper from 'vue-unit-helper';
import DashboardProjectsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-stats';

describe('Dashboard stats component', () => {
  let sandbox;
  let DashboardProjectsComponentWithMocks;
  let MockDojoService;
  let MockEventService;
  let vm;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojoService = {
      getUsersDojos: sandbox.stub(),
    };
    MockEventService = {
      searchApplicationsByDojo: sandbox.stub(),
    };
    DashboardProjectsComponentWithMocks = DashboardProjectsComponent({
      '@/dojos/service': MockDojoService,
      '@/events/service': MockEventService,
    });
    vm = vueUnitHelper(DashboardProjectsComponentWithMocks);
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('methods', () => {
    describe('getDojos', () => {
      it('should load the users Dojos into dojos and define the current DojoId', async () => {
        // ARRANGE
        const mockUserDojos = [{ dojoId: 'd1', userId: 'u1' }];
        MockDojoService.getUsersDojos.resolves({ body: mockUserDojos });
        vm.loggedInUser = { id: 'u1' };
        // ACT
        await vm.getDojos();

        // ASSERT
        expect(MockDojoService.getUsersDojos).to.have.been.calledOnce;
        expect(MockDojoService.getUsersDojos).to.have.been.calledWith('u1');

        expect(vm.dojos).to.deep.equal(mockUserDojos);
        expect(vm.dojoId).to.equal('d1');
      });
    });
    describe('getBookedChildren', () => {
      it('should load the dojos applications', async () => {
        // ARRANGE
        const mockApplications = [{ id: 'a1', ticketType: 'ninja' }];
        MockEventService.searchApplicationsByDojo.resolves({ body: mockApplications });
        vm.dojoId = 'd1';
        // ACT
        await vm.getBookedChildren();

        // ASSERT
        expect(MockEventService.searchApplicationsByDojo).to.have.been.calledOnce;
        expect(MockEventService.searchApplicationsByDojo).to.have.been.calledWith(
          'd1',
          { deleted: 0, ticketType: 'ninja', status: { ne$: 'cancelled' } },
        );
        expect(vm.bookedChildren).to.equal(1);
      });
    });
  });

  describe('created', () => {
    it('should call getDojos && getBookedChildren', async () => {
      // ARRANGE
      sandbox.stub(vm, 'getDojos');
      sandbox.stub(vm, 'getBookedChildren');

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.getDojos).to.have.been.calledOnce;
      expect(vm.getBookedChildren).to.have.been.calledOnce;
    });
  });
});
