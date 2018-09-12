import vueUnitHelper from 'vue-unit-helper';
import DashboardComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard';

describe('Dashboard component', () => {
  let sandbox;
  let DashboardComponentWithMocks;
  let MockDojosService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojosService = {
      getUsersDojos: sandbox.stub(),
    };
    DashboardComponentWithMocks = DashboardComponent({
      '@/dojos/service': MockDojosService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('computed', () => {
    describe('computed.championUserDojos', () => {
      it('should filter the user dojos with usertype "champion"', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardComponentWithMocks);
        vm.userDojos = [{ dojoId: 'd1', userTypes: ['banana'] }, { dojoId: 'd2', userTypes: ['banana', 'champion'] }];

        // ASSERT
        expect(vm.championUserDojos).to.eql([{ dojoId: 'd2', userTypes: ['banana', 'champion'] }]);
      });
    });
    describe('computed.statsAreVisible', () => {
      it('should return true if the user is a champion of a Dojo', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardComponentWithMocks);
        vm.championUserDojos = [{ dojoId: 'd2', userTypes: ['banana', 'champion'] }];

        // ASSERT
        expect(vm.statsAreVisible).to.be.true;
      });
      it('should return true if the user is a champion of a Dojo', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardComponentWithMocks);
        vm.championUserDojos = [];

        // ASSERT
        expect(vm.statsAreVisible).to.be.false;
      });
    });
  });

  describe('methods', () => {
    describe('methods.getUserDojos', () => {
      it('should load the current user\'s dojos', async () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardComponentWithMocks);
        const mockUserDojos = [{ dojoId: 'd1', userId: 'u1' }];
        MockDojosService.getUsersDojos.resolves({ body: mockUserDojos });
        vm.loggedInUser = {
          id: 'u1',
        };
        // ACT
        await vm.getUserDojos();

        // ASSERT
        expect(vm.userDojos).to.equal(mockUserDojos);
        expect(MockDojosService.getUsersDojos).to.have.been.calledOnce;
        expect(MockDojosService.getUsersDojos).to.have.been.calledWith('u1');
      });
    });
  });

  describe('created', () => {
    it('should call each method to load the data', async () => {
      const vm = vueUnitHelper(DashboardComponentWithMocks);
      vm.getUserDojos = sinon.stub().resolves();

      await vm.$lifecycleMethods.created();
      expect(vm.getUserDojos).to.have.been.calledOnce;
    });
  });
});
