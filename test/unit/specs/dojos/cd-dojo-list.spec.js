import Vue from 'vue';
import cdDojoList from '!!vue-loader?inject!@/dojos/cd-dojo-list';

define('The Dojo List vue ', () => {
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

  it('should show the list of dojos', (done) => {
    const mock = {
      getDojos: () => Promise.resolve({ body: expectedDojos }),
    };
    const cdDojosWithMocks = cdDojoList({
      './service': mock,
    });
    const vm = new Vue(cdDojosWithMocks).$mount();

    requestAnimationFrame(() => {
      vm.getDojos();

      expect(vm.dojos).to.deep.equal(expectedDojos);
      done();
    });
  });
});
