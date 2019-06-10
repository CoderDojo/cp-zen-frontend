import vueUnitHelper from 'vue-unit-helper';
import EventDetails from '!!vue-loader?inject!@/events/order/cd-event-details';

describe('Event Details', () => {
  let vm;
  let MockDojoUtils;
  let EventDetailsWithMocks;

  beforeEach(() => {
    MockDojoUtils = {
      imageUrl: sinon.stub(),
      fallbackImage: sinon.stub(),
    };
    EventDetailsWithMocks = EventDetails({
      '@/dojos/util': MockDojoUtils,
    });
    vm = vueUnitHelper(EventDetailsWithMocks);
    vm.$i18n = {
      t: val => val,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('computed', () => {
    it('should return the full address', () => {
      vm.eventDetails = {
        address: 'address',
        city: {
          nameWithHierarchy: 'cityName',
        },
        country: {
          countryName: 'countryName',
        },
      };
      expect(vm.fullAddress).to.equal('address, cityName, countryName');
    });
    it('should return the dojo custom image', () => {
      vm.eventDetails = {
        dojoId: '1',
      };
      MockDojoUtils.imageUrl.returns('http://google.com');
      const url = vm.dojoImage;
      expect(MockDojoUtils.imageUrl).to.have.been.calledOnce;
      expect(MockDojoUtils.imageUrl).to.have.been.calledWith('1');
      expect(url).to.equal('http://google.com');
    });
    it('should return the dojo custom image', () => {
      MockDojoUtils.fallbackImage.returns('http://google.com');
      const url = vm.dojoFallbackImage;
      expect(MockDojoUtils.fallbackImage).to.have.been.calledOnce;
      expect(url).to.equal('http://google.com');
    });
  });
});
