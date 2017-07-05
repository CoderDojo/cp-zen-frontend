import Vue from 'vue';
import vueUnitHelper from 'vue-unit-helper';
import cdFindDojo from '!!vue-loader?inject!@/dojos/cd-find-dojo';

const expectedDojosForAddress = [
  {
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
    address1: 'Pivotal Labs, CHQ building, Dublin 1',
    countryName: 'Ireland',
    email: '',
    facebook: null,
    googleGroup: null,
    twitter: null,
    notes: '<h2>Suggested Notes:<br />\n<br />\nPlease bring:</h2>\n\n<ul>\n\t<li>\n\t<h2>A laptop. Borrow one from somebody if needs be.</h2>\n\t</li>\n\t<li>\n\t<h2><strong>A parent! (Very important). If you are 12 or under, your parent must stay with you during the session.</strong></h2>\n\t</li>\n</ul>\n\n<h2>&nbsp;</h2>\n',
    placeName: 'Dublin',
    time: 'Sunday 10am',
    website: null,
  },
  {
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
    address1: 'CHQ Building,1 Custom House Quay, North Dock',
    countryName: 'Ireland',
    email: 'dublinninjakids@gmail.com',
    facebook: 'https://www.facebook.com/CoderDojo',
    googleGroup: 'dublinninjakids@google.group.com',
    twitter: 'https://twitter.com/CoderDojo',
    notes: '<p>This is the Dojo details section</p>\n',
    placeName: 'Dublin',
    time: 'Saturdays 11 am - 1 pm',
    website: 'www.dublinninjakids.com',
  },
];

const expectedDojosForLatLong = [{
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

const geoLocationServiceMock = {
  getLatitudeLongitudeByAddress: sinon.stub(),
};

const dojoServiceMock = {
  getDojosByLatLong: sinon.stub(),
};

function setUpFindDojoComponent() {
  const cdFindDojoWithMocks = cdFindDojo({
    './service': dojoServiceMock,
    '@/geolocation/service': geoLocationServiceMock,
  });
  return cdFindDojoWithMocks;
}

describe('The Find dojo vue ', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the user current location', (done) => {
    sandbox.stub(navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
      cb({
        coords: {
          latitude: 10,
          longitude: 89,
        },
      });
    });
    const vm = new Vue(cdFindDojo());
    vm.getCurrentLocation();
    requestAnimationFrame(() => {
      expect(vm.detectingLocation).to.equal(true);
      expect(vm.coordinates.latitude).to.equal(10);
      expect(vm.coordinates.longitude).to.equal(89);
      done();
    });
  });

  it('should stop he loading animation when user location not granted', (done) => {
    sandbox.stub(navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
      error();
    });
    const vm = new Vue(cdFindDojo());
    vm.getCurrentLocation();
    requestAnimationFrame(() => {
      expect(vm.detectingLocation).to.equal(false);
      expect(vm.coordinates.latitude).to.equal(null);
      expect(vm.coordinates.longitude).to.equal(null);
      done();
    });
  });

  it('should get coordinates from url and fetch all dojos for map', () => {
    const vm = vueUnitHelper(cdFindDojo());
    vm.lat = 11;
    vm.long = 88;
    sandbox.stub(vm, 'getDojosByLatLong');
    sandbox.stub(vm, 'getAllDojos');

    vm.$lifecycleMethods.created();

    expect(vm.detectingLocation).to.equal(false);
    expect(vm.coordinates.latitude).to.equal(11);
    expect(vm.coordinates.longitude).to.equal(88);
    expect(vm.getDojosByLatLong).to.have.been.calledOnce;
    expect(vm.getAllDojos).to.have.been.calledOnce;
  });

  it('should only get all Dojos when no coordinates from url', () => {
    const vm = vueUnitHelper(cdFindDojo());
    vm.lat = undefined;
    vm.long = undefined;
    sandbox.stub(vm, 'getDojosByLatLong');
    sandbox.stub(vm, 'getAllDojos');

    vm.$lifecycleMethods.created();

    expect(vm.getDojosByLatLong).not.to.have.been.called;
    expect(vm.getAllDojos).to.have.been.calledOnce;
  });

  it('should search dojo\'s by address', (done) => {
    // ARRANGE
    const FindDojoWithMock = setUpFindDojoComponent();
    dojoServiceMock.getDojosByLatLong
      .withArgs(12, 84)
      .returns(Promise.resolve({ body: expectedDojosForAddress }));
    geoLocationServiceMock.getLatitudeLongitudeByAddress
      .withArgs('CHQ')
      .returns(Promise.resolve({
        latitude: 12,
        longiutide: 84,
      }));
    const vm = vueUnitHelper(FindDojoWithMock);
    sandbox.stub(vm, 'getDojosByLatLong');
    vm.searchCriteria = 'CHQ';

    // ACT
    vm.searchDojosByAddress();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.coordinates).to.deep.equal({
        latitude: 12,
        longiutide: 84,
      });
      expect(vm.getDojosByLatLong).to.have.been.calledOnce;
      done();
    });
  });

  it('should load the list of dojos from lat long', (done) => {
    // ARRANGE
    const mock = {
      getDojosByLatLong: (lat, long) => {
        expect(lat).to.be.equal(10);
        expect(long).to.be.equal(89);
        return Promise.resolve({ body: expectedDojosForLatLong });
      },
    };
    const cdFindDojoWithMocks = cdFindDojo({
      './service': mock,
    });

    const vm = vueUnitHelper(cdFindDojoWithMocks);
    vm.coordinates = {
      latitude: 10,
      longitude: 89,
    };

    // ACT
    vm.getDojosByLatLong();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.searchExecuted).to.equal(true);
      expect(vm.detectingLocation).to.equal(false);
      expect(vm.dojos).to.deep.equal(expectedDojosForLatLong);
      done();
    });
  });

  describe('getAllDojos()', () => {
    it('should load all Dojos', (done) => {
      // ARRANGE
      const DojoServiceMock = {
        getDojos: sandbox.stub(),
      };
      DojoServiceMock.getDojos.withArgs({
        verified: 1,
        deleted: 0,
        fields$: ['name', 'geo_point', 'stage', 'url_slug', 'private'],
      }).returns(Promise.resolve({ body: expectedDojosForAddress }));
      const FindDojoWithMocks = cdFindDojo({
        './service': DojoServiceMock,
      });
      const vm = vueUnitHelper(FindDojoWithMocks);

      // ACT
      vm.getAllDojos();

      // ASSERT
      requestAnimationFrame(() => {
        expect(vm.allDojos).to.deep.equal(expectedDojosForAddress);
        done();
      });
    });
  });

  describe('toggleMap()', () => {
    it('should toggle showMap and trigger resize event when map is shown', () => {
      // ARRANGE
      const vm = vueUnitHelper(cdFindDojo());
      vm.showMap = false;
      Vue.$gmapDefaultResizeBus = {
        $emit: sandbox.stub(),
      };

      // ACT
      vm.toggleMap();

      // ASSERT
      expect(vm.showMap).to.equal(true);
      expect(Vue.$gmapDefaultResizeBus.$emit).to.have.been.calledOnce;
      expect(Vue.$gmapDefaultResizeBus.$emit).to.have.been.calledWith('resize');
    });

    it('should toggle showMap and not trigger resize event when map is hidden', () => {
      // ARRANGE
      const vm = vueUnitHelper(cdFindDojo());
      vm.showMap = true;
      Vue.$gmapDefaultResizeBus = {
        $emit: sandbox.stub(),
      };

      // ACT
      vm.toggleMap();

      // ASSERT
      expect(vm.showMap).to.equal(false);
      expect(Vue.$gmapDefaultResizeBus.$emit).to.not.have.been.called;
    });
  });

  describe('computed.allActiveDojos', () => {
    it('should filter out non-active dojos from allDojos', () => {
      // ARRANGE
      const FindDojoWithMocks = cdFindDojo();

      const vm = vueUnitHelper(FindDojoWithMocks);
      vm.allDojos = [
        { name: 'Dojo1', stage: 1 },
        { name: 'Dojo2', stage: 4 },
        { name: 'Dojo3', stage: 2 },
        { name: 'Dojo4', stage: 0 },
        { name: 'Dojo5', stage: 4 },
      ];

      // ASSERT
      expect(vm.allActiveDojos).to.deep.equal([
        { name: 'Dojo1', stage: 1 },
        { name: 'Dojo3', stage: 2 },
        { name: 'Dojo4', stage: 0 },
      ]);
    });
  });
});
