import vueUnitHelper from 'vue-unit-helper';
import DojoMap from '@/dojos/cd-dojo-map';

describe('Dojo map', () => {
  describe('getMarkerPosition(dojo)', () => {
    it('should return an object with lat and lng when dojo has geoPoint', () => {
      const dojoMock = {
        geoPoint: {
          lat: 1,
          lon: 2,
        },
      };
      const vm = vueUnitHelper(DojoMap);

      expect(vm.getMarkerPosition(dojoMock)).to.deep.equal({
        lat: 1,
        lng: 2,
      });
    });

    it('should return an object with lat and lng when dojo has geo_point', () => {
      const dojoMock = {
        geo_point: {
          lat: 1,
          lon: 2,
        },
      };
      const vm = vueUnitHelper(DojoMap);

      expect(vm.getMarkerPosition(dojoMock)).to.deep.equal({
        lat: 1,
        lng: 2,
      });
    });
  });
});
