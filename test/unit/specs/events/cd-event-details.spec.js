import vueUnitHelper from 'vue-unit-helper';
import EventDetails from '!!vue-loader?inject!@/events/cd-event-details';

describe('Event Details', () => {
  let vm;
  let sandbox;
  let MockEventService;
  let MockDojoService;
  let MockDojoUtils;
  let EventDetailsWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventService = {
      loadEvent: sandbox.stub(),
    };
    MockDojoService = {
      getDojoById: sandbox.stub(),
    };
    MockDojoUtils = {
      imageUrl: sandbox.stub(),
      fallbackImage: sandbox.stub(),
    };
    EventDetailsWithMocks = EventDetails({
      './service': MockEventService,
      '@/dojos/service': MockDojoService,
      '@/dojos/util': MockDojoUtils,
    });
    vm = vueUnitHelper(EventDetailsWithMocks);
    vm.$i18n = {
      t: val => val,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should display Event details', async () => {
    // ARRANGE
    vm.eventId = 1;

    // ACT
    await vm.loadEvent();

    // ASSERT
    expect(MockEventService.loadEvent).have.been.calledWith(vm.eventId);
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

  describe('created', () => {
    it('should load the dojo and the event on creation', async () => {
      vm.loadEvent = sandbox.stub().resolves({ body: { apple: 1 } });
      vm.loadDojo = sandbox.stub().resolves({ body: { banana: 1 } });

      await vm.$lifecycleMethods.created();
      expect(vm.loadEvent).to.have.been.calledOnce;
      expect(vm.eventDetails).to.deep.equal({ apple: 1 });
      expect(vm.loadDojo).to.have.been.calledOnce;
      expect(vm.dojo).to.deep.equal({ banana: 1 });
    });
  });
});
