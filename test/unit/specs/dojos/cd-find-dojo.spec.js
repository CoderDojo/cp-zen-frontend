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

function setUpFindDojoComponent(mockBody) {
  const mock = {
    getDojosByAddress: (/* address */) => Promise.resolve({ body: mockBody }),
  };
  const cdFindDojoWithMocks = cdFindDojo({
    './service': mock,
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
    const vm = new Vue(cdFindDojo());
    vm.getCurrentLocation();
    requestAnimationFrame(() => {
      expect(vm.coordinates.latitude).to.equal(10);
      expect(vm.coordinates.longitude).to.equal(89);
      done();
    });
  });

  it('should get coordinates from url', () => {
    const vm = vueUnitHelper(cdFindDojo());
    vm.lat = 11;
    vm.long = 88;
    sandbox.stub(vm, 'getDojosByLatLong');

    vm.$lifecycleMethods.created();

    expect(vm.coordinates.latitude).to.equal(11);
    expect(vm.coordinates.longitude).to.equal(88);
    expect(vm.getDojosByLatLong).to.have.been.calledOnce;
  });

  it('should search dojo\'s by address', (done) => {
    // ARRANGE
    const FindDojoWithMock = setUpFindDojoComponent(expectedDojosForAddress);
    const vm = vueUnitHelper(FindDojoWithMock);
    vm.searchCriteria = 'CHQ';
    // ACT
    vm.searchDojosByAddress();
    requestAnimationFrame(() => {
      // ASSERT
      expect(vm.dojos).to.deep.equal(expectedDojosForAddress);
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
      expect(vm.dojos).to.deep.equal(expectedDojosForLatLong);
      done();
    });
  });
});
