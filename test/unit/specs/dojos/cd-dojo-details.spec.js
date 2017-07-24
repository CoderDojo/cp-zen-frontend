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
    it('should return undefined when address1 is falsey', () => {
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.dojoDetails = {};
      expect(vm.address).to.be.undefined;
    });

    it('should return computed address when address1 is truthy', () => {
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.dojoDetails = {
        address1: 'CHQ',
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      expect(vm.address).to.equal('CHQ, Dublin, Ireland');
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

  describe('computed.formattedDojoWebsite()', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(DojoDetailsWithMocks);
    });

    it('should append http:// to a url which is missing it', () => {
      vm.dojoDetails.website = 'www.dublinninjakids.com';
      expect(vm.formattedDojoWebsite).to.equal('http://www.dublinninjakids.com');
    });
    it('should not append http:// to a url which contains http:// or https://', () => {
      vm.dojoDetails.website = 'http://www.dublinninjakids.com';
      expect(vm.formattedDojoWebsite).to.equal('http://www.dublinninjakids.com');
      vm.dojoDetails.website = 'https://www.dublinninjakids.com';
      expect(vm.formattedDojoWebsite).to.equal('https://www.dublinninjakids.com');
    });
  });
});
