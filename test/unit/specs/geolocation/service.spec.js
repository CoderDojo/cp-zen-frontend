import Vue from 'vue';
import GeolocationService from '@/geolocation/service';

describe('Geolocation Service', () => {
  let sandbox;

  const expectedIpCountryDetails = {
    continent: {
      code: 'EU',
      geoname_id: 6255148,
      names: {
        de: 'Europa',
        en: 'Europe',
        es: 'Europa',
        fr: 'Europe',
        ja: 'ヨーロッパ',
        'pt-BR': 'Europa',
        ru: 'Европа',
        'zh-CN': '欧洲',
      },
    },
    country: {
      geoname_id: 2963597,
      iso_code: 'IE',
      names: {
        de: 'Irland',
        en: 'Ireland',
        es: 'Irlanda',
        fr: 'Irlande',
        ja: 'アイルランド',
        'pt-BR': 'Irlanda',
        ru: 'Ирландия',
        'zh-CN': '爱尔兰',
      },
      tld: '.ie',
    },
    registered_country: {
      geoname_id: 2963597,
      iso_code: 'IE',
      names: {
        de: 'Irland',
        en: 'Ireland',
        es: 'Irlanda',
        fr: 'Irlande',
        ja: 'アイルランド',
        'pt-BR': 'Irlanda',
        ru: 'Ирландия',
        'zh-CN': '爱尔兰',
      },
      tld: '.ie',
    },
  };

  const mockGeocoderResults = [{
    geometry: {
      location: {
        lat: () => 10,
        lng: () => 89,
      },
    },
  }];

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getIpCountryDetails()', () => {
    it('should get country data from users IP', (done) => {
      const httpStub = sandbox.stub(Vue.http, 'get');
      httpStub.withArgs(`${Vue.config.apiServer}/api/2.0/ip-country-details`)
        .returns(Promise.resolve({ body: expectedIpCountryDetails }));

      GeolocationService.getIpCountryDetails().then((response) => {
        expect(response.body).to.deep.equal(expectedIpCountryDetails);
        done();
      });
    });
  });

  describe('getLatitudeLongitudeByAddress()', () => {
    it('should return coordinates for given address', (done) => {
      // ARRANGE
      sandbox.stub(GeolocationService, 'getIpCountryDetails').returns(Promise.resolve({ body: expectedIpCountryDetails }));
      sandbox.stub(GeolocationService, 'geocode').returns(Promise.resolve(mockGeocoderResults));

      // ACT
      GeolocationService.getLatitudeLongitudeByAddress()
        .then((coords) => {
          // ASSERT
          expect(coords.latitude).to.equal(10);
          expect(coords.longitude).to.equal(89);
          done();
        });
    });
  });

  describe('geocode()', () => {
    let status;

    const mockGeocoder = {
      geocode(geocoderSearchOptions, cb) {
        cb(mockGeocoderResults, status);
      },
    };

    beforeEach(() => {
      sandbox.spy(mockGeocoder, 'geocode');
      window.google = {
        maps: {
          Geocoder: sandbox.stub().returns(mockGeocoder),
        },
      };
    });

    it('should get geolocation data for given search parameters', (done) => {
      status = 'OK';
      requestAnimationFrame(() => {
        GeolocationService.geocode({
          address: 'CHQ',
          region: 'IE',
        }).then((results) => {
          expect(window.google.maps.Geocoder).to.have.been.calledOnce;
          expect(mockGeocoder.geocode).to.have.been.calledWithMatch({
            address: 'CHQ',
            region: 'IE',
          });
          expect(results).to.deep.equal(mockGeocoderResults);
          expect(GeolocationService.geocoder).to.equal(mockGeocoder);
        });
        done();
      });
    });

    it('should reject the promise if status is not OK', (done) => {
      status = 'ERROR';
      requestAnimationFrame(() => {
        GeolocationService.geocode({
          address: 'CHQ',
          region: 'IE',
        }).catch((cb) => {
          cb();
        });
        done();
      });
    });

    it('should reuse existing geocoder if exists', (done) => {
      // ARRANGE
      const existingMockGeocoder = {
        geocode: sinon.stub(),
      };
      GeolocationService.geocoder = existingMockGeocoder;

      requestAnimationFrame(() => {
        GeolocationService.geocode({
          address: 'CHQ',
          region: 'IE',
        }).then(() => {
          expect(existingMockGeocoder.geocode).to.have.been.calledOnce;
          expect(window.google.maps.Geocoder).to.not.have.been.called;
        });
        done();
      });
    });
  });
});
