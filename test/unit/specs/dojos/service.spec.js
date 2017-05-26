import Vue from 'vue';
import DojosService from '@/dojos/service';

define('Dojos Service', () => {
  const expectedDojos = [{
    entity$: '-/cd/dojos',
    name: 'CD ROM',
    geoPoint: {
      lat: 53.349351,
      lon: -6.247585999999956,
    },
    stage: 0,
    urlSlug: 'ie/dublin/cd-rom',
    private: 1,
    id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
  }, {
    entity$: '-/cd/dojos',
    name: 'Smithfield Awesome Dojo',
    geoPoint: {
      lat: 53.34899189999999,
      lon: -6.278343100000029,
    },
    stage: 0,
    urlSlug: 'ie/smithfield/smithfield-awesome-dojo',
    private: 0,
    id: '4e591bbe-667b-4782-bc9c-180c6d321883',
  }, {
    entity$: '-/cd/dojos',
    name: 'Dublin Ninja Kids',
    geoPoint: {
      lat: 53.348315,
      lon: -6.248111999999992,
    },
    stage: 0,
    urlSlug: 'ie/dublin/dublin-ninja-kids',
    private: 1,
    id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
  }];

  define('getDojos()', () => {
    let sandbox;
    let postMock;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      postMock = sandbox.stub(Vue.http, 'post');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should get dojos', (done) => {
      postMock.withArgs(`${Vue.config.apiBase}/dojos`).returns(Promise.resolve({ body: expectedDojos }));
      DojosService.getDojos().then((res) => {
        expect(res.body).to.deep.equal(expectedDojos);
        done();
      });
    });

    it('should get dojos by latitude and longitude', (done) => {
      const expectedQuery = {
        query: {
          lat: 10,
          long: 89,
          radius: 50,
        },
      };
      postMock.withArgs(`${Vue.config.apiBase}/dojos/search-bounding-box`, expectedQuery).returns(Promise.resolve({ body: expectedDojos }));
      DojosService.getDojosByLatLong(10, 89).then((res) => {
        expect(res.body).to.deep.equal(expectedDojos);
        done();
      });
    });
  });
});
