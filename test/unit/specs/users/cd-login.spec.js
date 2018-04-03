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
    };
    LoginComponentWithMocks = LoginComponent({
      './service': MockUserService,
    });
  });

  afterEach(() => {
    sandbox.restore();
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

    it('should return false when validateAll throws an error', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LoginComponentWithMocks);
      vm.$validator = {
        validateAll: () => {
          throw new Error('Invalid form');
        },
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
    });

    it('should do nothing if form is invalid', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(false);

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.loginFailed).to.equal(false);
      expect(MockUserService.login).to.not.have.been.called;
      expect(vm.$router.push).to.not.have.been.called;
    });

    it('should set loginFailed to true if login fails', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: { ok: false } });

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.loginFailed).to.equal(true);
      expect(vm.$router.push).to.not.have.been.called;
    });

    it('should redirect to the homepage when login succeeds and no referer is set', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: {} });

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.loginFailed).to.equal(false);
      expect(vm.$router.push).to.have.been.calledOnce;
      expect(vm.$router.push).to.have.been.calledWith('/');
    });

    it('should redirect to the referer when login succeeds and referer is set', async () => {
      // ARRANGE
      sandbox.stub(vm, 'validateForm').resolves(true);
      MockUserService.login.resolves({ body: {} });
      vm.$route.query.referer = '/book';

      // ACT
      await vm.login();

      // ASSERT
      expect(vm.loginFailed).to.equal(false);
      expect(vm.$router.push).to.have.been.calledOnce;
      expect(vm.$router.push).to.have.been.calledWith('/book');
    });
  });
});
