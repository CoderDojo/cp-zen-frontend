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

  describe('methods', () => {
    describe('dismissNotice', () => {
      it('should set cookieDisclaimer cookie to confirmed if value is true', (done) => {
        // ARRANGE
        sandbox.stub(vm, '$destroy');

        // ACT
        vm.dismissNotice();

        // ASSERT
        expect(vm.confirmed).to.equal(true);
        expect(CookieMock.set).to.have.been.calledOnce;
        expect(CookieMock.set).to.have.been.calledWith('cookieDisclaimer', 'confirmed');
        vm.$nextTick(() => {
          expect(vm.$destroy).to.have.been.calledOnce;
          done();
        });
      });
    });
  });

  describe('created()', () => {
    beforeEach(() => {
      sandbox.stub(vm, 'dismissNotice');
    });

    it('should call dismissNotice if cookieDisclaimer cookie is confirmed', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns('confirmed');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.dismissNotice).to.have.been.calledOnce;
    });

    it('should set confirmed to false if cookieDisclaimer cookie is not confirmed', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns('foo');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.dismissNotice).to.not.have.been.called;
    });

    it('should set confirmed to false if cookieDisclaimer cookie is undefined', () => {
      // ARRANGE
      CookieMock.get.withArgs('cookieDisclaimer').returns(undefined);

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.dismissNotice).to.not.have.been.called;
    });
  });
});
