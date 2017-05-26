import Vue from 'vue';
import cdFindDojo from '@/dojos/cd-find-dojo';

define('The Find dojo vue ', () => {
  it('should get the user current location', (done) => {
    navigator.geolocation = navigator.geolocation || {
      getCurrentPosition() {
      },
    };
    sinon.stub(navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
      cb({
        coords: {
          latitude: 10,
          longitude: 89,
        },
      });
    });
    const vm = new Vue(cdFindDojo);
    vm.getCurrentLocation();
    requestAnimationFrame(() => {
      expect(vm.coordinates.latitude).to.equal(10);
      expect(vm.coordinates.longitude).to.equal(89);
      done();
    });
  });

  it('should get coordinates from url', (done) => {
    const Constructor = Vue.extend(cdFindDojo);
    const vm = new Constructor({
      propsData: {
        lat: 11,
        long: 88,
      },
    }).$mount();

    requestAnimationFrame(() => {
      expect(vm.coordinates.latitude).to.equal(11);
      expect(vm.coordinates.longitude).to.equal(88);
      done();
    });
  });
});
