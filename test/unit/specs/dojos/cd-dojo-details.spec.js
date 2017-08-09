import vueUnitHelper from 'vue-unit-helper';
import dojoDetails from '!!vue-loader?inject!@/dojos/cd-dojo-details';

describe('Dojo details component', () => {
  let sandbox;
  let DojoDetailsWithMocks;
  let DojoServiceMock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    DojoServiceMock = {
      getByUrlSlug: sandbox.stub(),
    };
    DojoDetailsWithMocks = dojoDetails({
      './service': DojoServiceMock,
    });
  });

  const dojoDetailsWithAddress =
    {
      id: 1,
      name: 'Dublin Ninja Kids',
      location: 'Dublin',
      address1: 'CHQ',
      placeName: 'Dublin',
      countryName: 'Ireland',
    };

  it('should show dojo details', (done) => {
    DojoServiceMock.getByUrlSlug.returns(Promise.resolve({ body: dojoDetailsWithAddress }));
    const vm = vueUnitHelper(DojoDetailsWithMocks);

    vm.loadDojoDetails();
    requestAnimationFrame(() => {
      expect(vm.dojoDetails).to.deep.equal(dojoDetailsWithAddress);
      done();
    });
  });

  it('should build the urlSlug from path parameters', () => {
    // ARRANGE
    DojoServiceMock.getByUrlSlug.returns(Promise.resolve({ body: dojoDetailsWithAddress }));
    const vm = vueUnitHelper(DojoDetailsWithMocks);
    vm.country = 'za';
    vm.path = 'gauteng/johannesburg-rock-stars';

    // ASSERT
    expect(vm.urlSlug).to.equal('za/gauteng/johannesburg-rock-stars');
  });

  it('should compute an image url for given dojo id', (done) => {
    // ARRANGE
    DojoServiceMock.getByUrlSlug.returns(Promise.resolve({ body: dojoDetailsWithAddress }));
    const vm = vueUnitHelper(DojoDetailsWithMocks);

    // ASSERT
    vm.loadDojoDetails();
    requestAnimationFrame(() => {
      expect(vm.imageUrl).to.equal(`https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${dojoDetailsWithAddress.id}`);
      done();
    });
  });

  describe('computed.address()', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(dojoDetails());
    });

    it('should return undefined when address1 and placeName are falsey', () => {
      vm.dojoDetails = {};
      expect(vm.address).to.be.undefined;
    });

    it('should return address1 when address1 is truthy', () => {
      vm.dojoDetails = {
        address1: 'CHQ, Dublin, Ireland',
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      expect(vm.address).to.equal('CHQ, Dublin, Ireland');
    });

    it('should return placeName when address1 is falsey and placeName is truthy', () => {
      vm.dojoDetails = {
        address1: null,
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      expect(vm.address).to.equal('Dublin');
    });
  });

  describe('computed.googleMapsLink', () => {
    it('should return a link to google maps with the Dojos lat and long', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.dojoDetails = {
        geoPoint: {
          lat: 53.349351,
          lon: -6.247585999999956,
        },
      };

      // ASSERT
      expect(vm.googleMapsLink).to.equal('https://www.google.com/maps/search/?api=1&query=53.349351,-6.247585999999956');
    });
  });

  describe('computed.canAdmin', () => {
    it('should return true when the logged in user is a CDF admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {
        roles: ['cdf-admin'],
      };

      // ASSERT
      expect(vm.canAdmin).to.equal(true);
    });

    it('should return false when user is null', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = null;

      // ASSERT
      expect(vm.canAdmin).to.equal(false);
    });

    it('should return false when the logged in user is not a CDF admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {
        roles: ['basic-user'],
      };

      // ASSERT
      expect(vm.canAdmin).to.equal(false);
    });

    it('should return false when the logged in user has no roles', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {};

      // ASSERT
      expect(vm.canAdmin).to.equal(false);
    });
  });
});
