import vueUnitHelper from 'vue-unit-helper';
import ManageUsersComponent from '!!vue-loader?inject!@/users/cdf-manage';

describe('CDFManageUsers', () => {
  let sandbox;
  let MockUserService;
  let MockDojoService;
  let MockForumService;
  let ManageUsersComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockUserService = {
      getCurrentCDFUser: sandbox.stub(),
      getChildren: sandbox.stub(),
      search: sandbox.stub(),
      load: sandbox.stub(),
      delete: sandbox.stub(),
    };
    MockDojoService = {
      getUsersDojos: sandbox.stub(),
      getDojoById: sandbox.stub(),
    };
    MockForumService = {
      user: {
        search: sandbox.stub(),
      },
    };

    ManageUsersComponentWithMocks = ManageUsersComponent({
      './service': MockUserService,
      '@/dojos/service': MockDojoService,
      '@/forum/service': MockForumService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDojo()', () => {
    it('should return the dojo by id from the list of loaded dojos', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.dojos = [{ id: 1, name: 'banana' }];
      // ACT
      const dojo = vm.getDojo(1);

      // ASSERT
      expect(dojo.id).to.equal(1);
      expect(dojo.name).to.equal('banana');
    });
  });
  describe('isDojoOwnerOf()', () => {
    it('should return true if the user is the owner', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      // ASSERT
      expect(vm.isDojoOwnerOf({ owner: 1 })).to.be.true;
    });
    it('should return false if the user is not the owner', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      // ASSERT
      expect(vm.isDojoOwnerOf({ owner: 0 })).to.be.false;
    });
  });
  describe('isChampionOf()', () => {
    it('should return true if the user is the owner', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      // ASSERT
      expect(vm.isChampionOf({ userTypes: ['champion'] })).to.be.true;
    });
    it('should return false if the user is not the owner', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      // ASSERT
      expect(vm.isChampionOf({ userTypes: ['mentor'] })).to.be.false;
    });
  });
  describe('searchUser()', () => {
    it('should call the router to change route', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.$router = {
        push: sandbox.stub(),
      };
      vm.email = 'test@test.com';
      // ACT
      vm.searchUser();
      // ASSERT
      expect(vm.$router.push).to.have.been.calledWith({ name: 'CDFUsersManagement', query: { email: 'test@test.com' } });
    });
  });
  describe('reset()', () => {
    it('should set the state of errors and data back to zero', () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.user = null;
      vm.children = null;
      vm.dojos = null;
      vm.memberships = null;
      // ACT
      vm.reset();
      // ASSERT
      expect(vm.user).to.eql({});
      expect(vm.children).to.eql([]);
      expect(vm.dojos).to.eql([]);
      expect(vm.memberships).to.eql([]);
    });
  });
  describe('getUserInfos()', () => {
    it('should search the user by its email', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
      };
      vm.email = 'test@test.com';
      MockUserService.search.resolves({ body: { results: [{ id: '123', profile: { userId: '123' } }], total: 1 } });

      // ACT
      await vm.getUserInfos();
      // ASSERT
      expect(MockUserService.search).to.have.been.calledWith({ email: 'test@test.com', related: 'profile' });
      expect(vm.user).to.eql({ id: '123', profile: { userId: '123' } });
    });
    it('should search the user by its email and throw if not found', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
        add: sandbox.stub(),
      };
      vm.email = 'test@test.com';
      MockUserService.search.resolves({ body: { results: [], total: 0 } });

      // ACT
      await vm.getUserInfos();
      // ASSERT
      expect(MockUserService.search).to.have.been.calledWith({ email: 'test@test.com', related: 'profile' });
      expect(vm.errors.add).to.have.been.calledOnce.and.calledWith('userNotFound', 'Invalid email');
    });
    it('should get the user data by its userId', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
      };
      vm.userId = '123';
      vm.email = '';
      MockUserService.load.resolves({ body: { id: '123', profile: { userId: '123' } } });
      // ACT
      await vm.getUserInfos();
      // ASSERT
      expect(MockUserService.load).to.have.been.calledWith('123', { related: 'profile' });
      expect(vm.user).to.eql({ id: '123', profile: { userId: '123' } });
    });
    it('should get the user membership data', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
      };
      MockUserService.load.resolves({ body: { id: 1, email: 'user@example.com' } });
      MockUserService.getChildren.resolves({ body: [{ id: 'c1' }] });
      MockDojoService.getUsersDojos.resolves({ body: [{ dojoId: 'd1' }, { dojoId: 'd2' }] });
      MockDojoService.getDojoById.onFirstCall().resolves({ body: { id: 'd1' } });
      MockDojoService.getDojoById.onSecondCall().resolves({ body: { id: 'd2' } });
      MockForumService.user.search.resolves({ body: { uid: 1 } });
      vm.userId = '123';
      vm.email = '';
      // ACT
      await vm.getUserInfos();
      // ASSERT
      expect(MockUserService.load).to.have.been.calledWith('123', { related: 'profile' });
      expect(MockDojoService.getUsersDojos).to.have.been.calledWith(1);
      expect(MockDojoService.getDojoById).to.have.been.calledTwice;
      expect(MockDojoService.getDojoById.getCall(0)).to.have.been.calledWith('d1');
      expect(MockDojoService.getDojoById.getCall(1)).to.have.been.calledWith('d2');
      expect(MockForumService.user.search).to.have.been.calledWith('user@example.com');
      expect(vm.children).to.eql([{ id: 'c1' }]);
      expect(vm.memberships).to.eql([{ dojoId: 'd1' }, { dojoId: 'd2' }]);
      expect(vm.dojos).to.eql([{ id: 'd1' }, { id: 'd2' }]);
      expect(vm.forumUser).to.eql({ uid: 1 });
    });

    it('should register an error on retrieval of data', async () => {
       // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
        add: sandbox.stub(),
      };
      vm.userId = '123';
      const err = new Error('404 - "Invalid userId"');
      err.status = 404;
      err.body = {
        message: '404 - "Invalid userId"',
      };
      MockUserService.load.throws(err);
      // ACT
      await vm.getUserInfos();
      // ASSERT
      expect(vm.errors.add).to.have.been.calledWith('userNotFound', err.body.message);
    });
  });
  describe('deleteUser()', () => {
    it('should hardDelete', async () => {
       // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.user = {
        id: 'u1',
      };
      vm.errors = {
        clear: sandbox.stub(),
      };
      window.confirm = sandbox.stub().returns(true);
      // ACT
      await vm.deleteUser();
      // ASSERT
      expect(MockUserService.delete).to.have.been.calledWith('u1', { soft: false, cascade: true });
      expect(vm.deleted).to.be.true;
    });
    it('should softDelete', async () => {
      // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.user = {
        id: 'u1',
      };
      vm.errors = {
        clear: sandbox.stub(),
      };
      window.confirm = sandbox.stub().returns(true);
      // ACT
      await vm.deleteUser(true);
      // ASSERT
      expect(MockUserService.delete).to.have.been.calledWith('u1', { soft: true, cascade: true });
      expect(vm.deleted).to.be.true;
    });
    it('should register an error on retrieval of data', async () => {
       // ARRANGE
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.errors = {
        clear: sandbox.stub(),
        add: sandbox.stub(),
      };
      vm.user = {
        id: 'u1',
      };
      window.confirm = sandbox.stub().returns(true);
      const err = new Error();
      err.status = 500;
      MockUserService.delete.throws(err);
      // ACT
      await vm.deleteUser(true);
      // ASSERT
      expect(vm.errors.add).to.have.been.calledWith('deletionFailed', 'Something went absolutly wrong');
      expect(vm.deleted).to.be.false;
    });
  });
  describe('created', () => {
    it('should set the email if the param exists', async () => {
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.$router = { replace: sandbox.stub() };
      vm.reset = sandbox.stub();
      vm.getUserInfos = sandbox.stub();
      vm.$route = {
        query: {
          email: 'test@test.com',
        },
      };
      vm.isLoggedIn = true;

      await vm.$lifecycleMethods.created();
      expect(vm.email).to.equal('test@test.com');
      expect(vm.getUserInfos).to.have.been.calledOnce;
    });
    it('should set the userId if the param exists and email doesnt', async () => {
      const vm = vueUnitHelper(ManageUsersComponentWithMocks);
      vm.$router = { replace: sandbox.stub() };
      vm.reset = sandbox.stub();
      vm.getUserInfos = sandbox.stub();
      vm.$route = {
        query: {
          userId: '123',
        },
      };
      vm.isLoggedIn = true;

      await vm.$lifecycleMethods.created();
      expect(vm.email).to.equal('');
      expect(vm.userId).to.equal('123');
      expect(vm.getUserInfos).to.have.been.calledOnce;
    });
  });
});
