import Vue from 'vue';
import LocaleService from '@/locale/service';

describe('Locale Service', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getStrings()', () => {
    it('should get the strings for the given language', (done) => {
      // ARRANGE
      sinon.stub(Vue.http, 'get')
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
