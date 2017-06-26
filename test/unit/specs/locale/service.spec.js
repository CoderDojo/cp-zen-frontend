import Vue from 'vue';
import LocaleService from '@/locale/service';

describe('Locale Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getStrings()', () => {
    it('should get the strings for the given language', (done) => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get')
        .withArgs(`${Vue.config.apiServer}/locale/data?format=mf&lang=es_ES`)
        .returns(Promise.resolve('foo'));

      // ACT
      LocaleService.getStrings('es_ES').then((resp) => {
        expect(resp).to.equal('foo');
        done();
      });
    });
  });
});
