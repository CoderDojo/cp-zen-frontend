import vueUnitHelper from 'vue-unit-helper';
import RedirectToLoginComponent from '!!vue-loader?inject!@/users/cd-redirect-to-login';

describe('Redirect to Login', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    const vm = vueUnitHelper(RedirectToLoginComponent({}));
    it('should redirect to login with the right return url', () => {
      vm.url = 'bananas';
      expect(vm.login).to.deep.equal({ path: '/login?next=bananas' });
    });
  });
});
