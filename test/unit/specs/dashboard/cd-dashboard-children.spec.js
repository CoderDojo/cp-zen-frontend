import vueUnitHelper from 'vue-unit-helper';
import DashboardChildrenComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-children';

describe('Dashboard children component', () => {
  let sandbox;
  let DashboardChildrenComponentWithMocks;
  let MockUsersService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockUsersService = {
      getCurrentUser: sandbox.stub(),
      userProfileData: sandbox.stub(),
      getChildren: sandbox.stub(),
    };
    DashboardChildrenComponentWithMocks = DashboardChildrenComponent({
      '@/users/service': MockUsersService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('computed', () => {
    describe('computed.children', () => {
      it('should return a list containing the current user\'s children', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardChildrenComponentWithMocks);
        vm.userChildren = [{ id: '1' }];

        // ASSERT
        expect(vm.children).to.deep.equal([{ id: '1' }]);
      });
      it('should return a empty list if the current user has no children', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardChildrenComponentWithMocks);
        vm.userChildren = [];

        // ASSERT
        expect(vm.children).to.deep.equal([]);
      });
    });
  });

  describe('methods', () => {
    describe('methods.loadProfile', () => {
      it('should load the current user\'s profile', async () => {
        // ARRANGE
        const mockUserProfile = {
          id: '1',
        };
        MockUsersService.userProfileData.returns(Promise.resolve({ body: mockUserProfile }));
        const vm = vueUnitHelper(DashboardChildrenComponentWithMocks);
        vm.loggedInUser = {
          id: '1',
        };
        // ACT
        await vm.loadProfile();

        // ASSERT
        expect(vm.userProfile).to.equal(mockUserProfile);
      });
    });

    describe('methods.loadChildren', () => {
      it('should load the current user\'s children', async () => {
        // ARRANGE
        const mockChild = {
          userId: '1',
          user: { id: '1' },
        };
        MockUsersService.userProfileData.returns(Promise.resolve({ body: mockChild }));
        const vm = vueUnitHelper(DashboardChildrenComponentWithMocks);
        vm.userProfile = {
          id: '34',
          children: ['1'],
        };
        // ACT
        await vm.loadChildren();

        // ASSERT
        expect(vm.userChildren).to.deep.equal([mockChild]);
      });
    });
  });

  describe('created', () => {
    it('should call each method to load the data', async () => {
      const vm = vueUnitHelper(DashboardChildrenComponentWithMocks);
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.userProfile = {};
      vm.userChildren = [];

      await vm.$lifecycleMethods.created();
      expect(vm.loadProfile).to.have.been.calledOnce;
      expect(vm.loadChildren).to.have.been.calledOnce;
    });
  });
});
