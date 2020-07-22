import vueUnitHelper from 'vue-unit-helper';
import LangPicker from '!!vue-loader?inject!@/locale/cd-lang-picker';
import { expect } from 'chai';

describe('Lang Picker', () => {
  let CookieMock;
  let LocaleServiceMock;
  let MomentMock;
  let LangPickerWithMocks;
  let StoreMock;

  beforeEach(() => {
    CookieMock = {
      get: sinon.stub(),
      set: sinon.stub(),
    };
    LocaleServiceMock = {
      getStrings: sinon.stub(),
    };
    MomentMock = {
      locale: sinon.stub(),
    };
    LangPickerWithMocks = LangPicker({
      'js-cookie': CookieMock,
      './service': LocaleServiceMock,
      moment: MomentMock,
    });

    StoreMock = {
      dispatch: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('setMomentLocale(locale)', () => {
    it('should set moment locale', () => {
      // ARRANGE
      MomentMock.locale.withArgs('es-ar').returns('es');
      const vm = vueUnitHelper(LangPickerWithMocks);

      // ACT
      vm.setMomentLocale('es_AR');

      // ASSERT
      expect(MomentMock.locale).to.have.been.calledOnce;
      expect(MomentMock.locale).to.have.been.calledWith('es-ar');
    });

    it('should default to en if setting locale fails', () => {
      // ARRANGE
      MomentMock.locale.withArgs('mt-mt').returns('zh-tw');
      const vm = vueUnitHelper(LangPickerWithMocks);

      // ACT
      vm.setMomentLocale('mt_MT');

      // ASSERT
      expect(MomentMock.locale).to.have.been.calledTwice;
      expect(MomentMock.locale.getCall(0).args[0]).to.equal('mt-mt');
      expect(MomentMock.locale.getCall(1).args[0]).to.equal('en');
    });
  });

  describe('watchers', () => {
    describe('lang(val)', () => {
      it('should update the lang cookie with provided val, fetch strings, and update $i18n', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(LangPickerWithMocks);
        const stringsMock = {
          Hello: 'Hola',
          'Thank you': 'Gracias',
          foo: '',
        };
        vm.$i18n = {
          setLocaleMessage: sinon.stub(),
          locale: 'en_US',
        };
        LocaleServiceMock.getStrings.withArgs('es_ES').returns(Promise.resolve({ body: stringsMock }));
        sinon.stub(vm, 'setMomentLocale');
        vm.$store = StoreMock;

        // ACT
        vm.$watchers.lang('es_ES');

        // ASSERT
        requestAnimationFrame(() => {
          expect(CookieMock.set).to.have.been.calledWith('NG_TRANSLATE_LANG_KEY', '"es_ES"');
          expect(vm.setMomentLocale).to.have.been.calledOnce;
          expect(vm.setMomentLocale).to.have.been.calledWith('es_ES');
          expect(vm.$i18n.setLocaleMessage).to.have.been.calledWith('es_ES', {
            Hello: 'Hola',
            'Thank you': 'Gracias',
            foo: 'foo',
          });
          expect(vm.$i18n.locale).to.equal('es_ES');
          expect(StoreMock.dispatch.calledOnce).to.eq(true);
          done();
        });
      });
    });
  });

  describe('created()', () => {
    it('should recover languages from the API', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      vm.$store = StoreMock;
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns('"es_ES"');
      vm.getAvailableLanguages = sinon.stub().resolves({ body: ['a'] });
      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.getAvailableLanguages).to.have.been.calledOnce;
      expect(vm.availableLanguages).to.eql(['a']);
    });

    it('should set lang to the cookie if set', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns('"es_ES"');
      vm.getAvailableLanguages = sinon.stub().resolves({ body: [{ code: 'es_ES' }] });

      vm.$store = StoreMock;
      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('es_ES');
      expect(StoreMock.dispatch.calledOnce).to.eq(true);
    });

    it('should set lang to the browser locale if no cookie, and locale matches an available one', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      vm.$store = StoreMock;
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns(undefined);
      vm.getAvailableLanguages = sinon.stub().resolves({ body: [{ code: 'it_IT' }] });
      Object.defineProperty(window.navigator, 'language', { value: 'it-IT', configurable: true });

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('it_IT');
      expect(StoreMock.dispatch.calledOnce).to.eq(true);
    });

    it('should set lang to en_US if no cookie and browser locale doesnt match available lang', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      vm.$store = StoreMock;
      vm.getAvailableLanguages = sinon.stub().resolves({ body: [{ code: 'en_US' }] });
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns(undefined);
      Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true });

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('en_US');
      expect(StoreMock.dispatch.calledOnce).to.eq(true);
    });
  });
});
