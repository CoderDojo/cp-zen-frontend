import vueUnitHelper from 'vue-unit-helper';
import LoginComponent from '!!vue-loader?inject!@/users/cd-login';

describe('Login', () => {
  let sandbox;
  let MockUserService;
  let LoginComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockUserService = {
      login: sandbox.stub(),
      getCurrentUser: sandbox.stub(),
    };
    LoginComponentWithMocks = LoginComponent({
      './service': MockUserService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('redirectUrl', () => {
      it('should use the referer query param if set', () => {
        // ARRANGE
        const vm = vueUnitHelper(LoginComponentWithMocks);
        vm.$route = { query: { referer: '/test1' } };

        // ASSERT
        expect(vm.redirectUrl).to.equal('/test1');
      });

      it('should use the referrer query param if referer is not set', () => {
        // ARRANGE
        const vm = vueUnitHelper(LoginComponentWithMocks);
        vm.$route = { query: { referrer: '/test2' } };

        // ASSERT
        expect(vm.redirectUrl).to.equal('/test2');
      });

      it('should use / if neither referer or referrer are set', () => {
        // ARRANGE
        const vm = vueUnitHelper(LoginComponentWithMocks);
        vm.$route = { query: {} };

        // ASSERT
        expect(vm.redirectUrl).to.equal('/');
      });
    });
  });

  describe('validateForm()', () => {
    it('should return true when form is valid', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LoginComponentWithMocks);
      vm.$validator = {
        validateAll: () => true,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(true);
    });

    it('should return false when form is invalid', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LoginComponentWithMocks);
      vm.$validator = {
        validateAll: () => false,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });
  });

  describe('login()', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(LoginComponentWithMocks);
      vm.$router = { push: sandbox.stub() };
      vm.$route = { query: {} };
      vm.errors = {
        add: sandbox.stub(),
      };
    });

    it('should do nothing if form is invalid', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(false);

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.errors.add).to.not.have.been.called;
      expect(MockUserService.login).to.not.have.been.called;
      expect(vm.$router.push).to.not.have.been.called;
    });

    it('should add an error if login fails', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: { ok: false } });

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.errors.add).to.have.been.calledWith('loginFailed');
      expect(vm.$router.push).to.not.have.been.called;
    });

    it('should redirect to the redirectUrl when login succeeds', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: {} });
      vm.redirectUrl = '/dojos';

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.errors.add).to.not.have.been.called;
      expect(vm.$router.push).to.have.been.calledOnce;
      expect(vm.$router.push).to.have.been.calledWith('/dojos');
    });
    it('should redirect to the referer when login succeeds and referer is set', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: {} });
      vm.$route.query.referer = '/library';

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.errors.add).to.not.have.been.called;
      expect(vm.$router.push).to.have.been.calledOnce;
      expect(vm.$router.push).to.have.been.calledWith('/library');
    });
  });
  describe('created', () => {
    it('should redirect if the user is logged-in', async () => {
      const vm = vueUnitHelper(LoginComponentWithMocks);
      vm.$router = { replace: sandbox.stub() };
      vm.$route = {
        query: {
          referer: '/library',
        },
      };
      vm.isLoggedIn = true;

      await vm.$lifecycleMethods.created();
      expect(vm.$router.replace).to.have.been.calledOnce;
      expect(vm.$router.replace).to.have.been.calledWith('/library');
    });
  });
});

