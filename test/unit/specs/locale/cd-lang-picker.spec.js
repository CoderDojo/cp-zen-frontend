import vueUnitHelper from 'vue-unit-helper';
import LangPicker from '!!vue-loader?inject!@/locale/cd-lang-picker';

describe('Lang Picker', () => {
  let sandbox;
  let CookieMock;
  let LocaleServiceMock;
  let LangPickerWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    CookieMock = {
      get: sandbox.stub(),
      set: sandbox.stub(),
    };
    LocaleServiceMock = {
      getStrings: sandbox.stub(),
    };
    LangPickerWithMocks = LangPicker({
      'js-cookie': CookieMock,
      './service': LocaleServiceMock,
    });
  });

  afterEach(() => {
    sandbox.restore();
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
          setLocaleMessage: sandbox.stub(),
          locale: 'en_US',
        };
        LocaleServiceMock.getStrings.withArgs('es_ES').returns(Promise.resolve({ body: stringsMock }));

        // ACT
        vm.$watchers.lang('es_ES');

        // ASSERT
        requestAnimationFrame(() => {
          expect(CookieMock.set).to.have.been.calledWith('NG_TRANSLATE_LANG_KEY', '"es_ES"');
          expect(vm.$i18n.setLocaleMessage).to.have.been.calledWith('es_ES', {
            Hello: 'Hola',
            'Thank you': 'Gracias',
            foo: 'foo',
          });
          expect(vm.$i18n.locale).to.equal('es_ES');
          done();
        });
      });
    });
  });

  describe('created()', () => {
    it('should set lang to the cookie if set', () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns('"es_ES"');

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('es_ES');
    });

    it('should set lang to the browser locale if no cookie, and locale matches an available one', () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns(undefined);
      Object.defineProperty(window.navigator, 'language', { value: 'it-IT', configurable: true });

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('it_IT');
    });

    it('should set lang to en_US if no cookie and browser locale doesnt match available lang', () => {
      // ARRANGE
      const vm = vueUnitHelper(LangPickerWithMocks);
      CookieMock.get.withArgs('NG_TRANSLATE_LANG_KEY').returns(undefined);
      Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true });

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.lang).to.equal('en_US');
    });
  });
});
