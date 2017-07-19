import Vue from 'vue';
import vueUnitHelper from 'vue-unit-helper';
import dojoDetails from '!!vue-loader?inject!@/dojos/cd-dojo-details';

function setUpDojoDetailsComponent(mockBody) {
  const mock = {
    getByUrlSlug: (/* urlSlug */) => Promise.resolve({ body: mockBody }),
  };
  const dojoDetailsWithMocks = dojoDetails({
    './service': mock,
  });
  return dojoDetailsWithMocks;
}

describe('Dojo details component', () => {
  const dojoDetailsWithAddress =
    {
      id: 1,
      name: 'Dublin Ninja Kids',
      location: 'Dublin',
      address1: 'CHQ',
      placeName: 'Dublin',
      countryName: 'Ireland',
    };

  const dojoDetailsWithoutAddress =
    {
      id: 1,
      name: 'Dublin Ninja Kids',
      location: 'Dublin',
    };

  it('should show dojo details', (done) => {
    const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithAddress);
    const vm = new Vue(DojoDetailsWithMock);

    vm.loadDojoDetails();
    requestAnimationFrame(() => {
      expect(vm.dojoDetails).to.deep.equal(dojoDetailsWithAddress);
      done();
    });
  });

  it('should build the urlSlug from path parameters', () => {
    // ARRANGE
    const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithAddress);
    const vm = vueUnitHelper(DojoDetailsWithMock);
    vm.country = 'za';
    vm.path = 'gauteng/johannesburg-rock-stars';

    // ASSERT
    expect(vm.urlSlug).to.equal('za/gauteng/johannesburg-rock-stars');
  });

  it('should compute an image url for given dojo id', (done) => {
    // ARRANGE
    const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithAddress);
    const vm = new Vue(DojoDetailsWithMock);

    // ASSERT
    vm.loadDojoDetails();
    requestAnimationFrame(() => {
      expect(vm.imageUrl).to.equal(`https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${dojoDetailsWithAddress.id}`);
      done();
    });
  });

  describe('computed.address()', () => {
    it('should return undefined when address1 is falsey', () => {
      const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithoutAddress);
      const mockDojoDetails = {};
      const address = DojoDetailsWithMock.computed.address.bind({ dojoDetails: mockDojoDetails })();
      expect(address).to.be.undefined;
    });

    it('should return computed address when address1 is truthy', () => {
      const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithAddress);
      const mockDojoDetails = {
        address1: 'CHQ',
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      const address = DojoDetailsWithMock.computed.address.bind({ dojoDetails: mockDojoDetails })();
      expect(address).to.not.be.undefined;
    });
  });

  describe('computed.formattedDojoWebsite()', () => {
    let vm;

    beforeEach(() => {
      const DojoDetailsWithMock = setUpDojoDetailsComponent(dojoDetailsWithAddress);
      vm = vueUnitHelper(DojoDetailsWithMock);
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
