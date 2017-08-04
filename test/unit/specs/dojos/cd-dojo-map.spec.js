import vueUnitHelper from 'vue-unit-helper';
import DojoMap from '@/dojos/cd-dojo-map';

describe('Dojo map', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

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

    it('should return an empty object when dojo has no geoPoint or geo_point', () => {
      const dojoMock = {
        geoPoint: null,
      };
      const vm = vueUnitHelper(DojoMap);

      expect(vm.getMarkerPosition(dojoMock)).to.deep.equal({});
    });
  });

  describe('updateInfoWindow()', () => {
    it('should set content and position of info window based on dojo at given index', () => {
      // ARRANGE
      const mockDojo = {
        name: 'Dojo 2',
        geoPoint: {
          lat: 20,
          lon: 30,
        },
      };
      const vm = vueUnitHelper(DojoMap);

      // ACT
      vm.updateInfoWindow(mockDojo);

      // ASSERT
      expect(vm.infoWindowOpened).to.equal(true);
      expect(vm.selectedDojo).to.deep.equal({
        name: 'Dojo 2',
        geoPoint: {
          lat: 20,
          lon: 30,
        },
      });
    });
  });
});
