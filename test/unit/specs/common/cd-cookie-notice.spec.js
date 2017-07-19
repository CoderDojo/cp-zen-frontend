import vueUnitHelper from 'vue-unit-helper';
import CookieNotice from '!!vue-loader?inject!@/common/cd-cookie-notice';

describe('Cookie Notice component', () => {
  let sandbox;
  let CookieMock;
  let CookieNoticeWithMock;
  let vm;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    CookieMock = {
      set: sandbox.stub(),
      get: sandbox.stub(),
    };
    CookieNoticeWithMock = CookieNotice({
      'js-cookie': CookieMock,
    });
    vm = vueUnitHelper(CookieNoticeWithMock);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('watchers', () => {
    describe('$route', () => {
      it('should set confirmed to true if it isn\'t already', () => {
        // ARRANGE
        vm.confirmed = null;

        // ACT
        vm.$watchers.$route();

        // ASSERT
        expect(vm.confirmed).to.equal(true);
      });

      it('shouldn\'t do anything if confirmed is already true', () => {
        // ARRANGE
        vm.confirmed = true;

        // ACT
        vm.$watchers.$route();

        // ASSERT
        expect(vm.confirmed).to.equal(true);
      });
    });

    describe('cookieDisclaimer', () => {
      it('should set cookieDisclaimer cookie to confirmed if value is true', () => {
        // ACT
        vm.$watchers.confirmed(true);

        // ASSERT
        expect(CookieMock.set).to.have.been.calledOnce;
        expect(CookieMock.set).to.have.been.calledWith('cookieDisclaimer', 'confirmed');
      });

      it('should not set cookieDisclaimer cookie to confirmed if value is false', () => {
        // ACT
        vm.$watchers.confirmed(false);

        // ASSERT
        expect(CookieMock.set).to.have.not.been.called;
      });
    });
  });

  describe('created()', () => {
    it('should set confirmed to true if cookieDisclaimer cookie is confirmed', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns('confirmed');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.confirmed).to.equal(true);
    });

    it('should set confirmed to false if cookieDisclaimer cookie is not confirmed', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns('foo');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.confirmed).to.equal(false);
    });

    it('should set confirmed to false if cookieDisclaimer cookie is undefined', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns(undefined);

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.confirmed).to.equal(false);
    });
  });
});
