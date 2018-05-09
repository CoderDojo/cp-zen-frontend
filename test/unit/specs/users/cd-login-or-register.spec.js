import vueUnitHelper from 'vue-unit-helper';
import LoginOrRegisterComponent from '!!vue-loader?inject!@/users/cd-login-or-register';

describe('Login or register', () => {
  let sandbox;
  let MockDojoService;
  let MockEventsService;
  let LoginOrRegisterComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojoService = {
      getDojoById: sandbox.stub(),
    };
    MockEventsService = {
      loadEvent: sandbox.stub(),
    };

    LoginOrRegisterComponentWithMocks = LoginOrRegisterComponent({
      '@/dojos/service': MockDojoService,
      '@/events/service': MockEventsService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('loadEvent()', () => {
    it('should get the event details', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.eventId = 1;
      MockEventsService.loadEvent.resolves({ body: { bananas: 1 } });

      // ACT
      await vm.loadEvent();

      // ASSERT
      expect(MockEventsService.loadEvent).to.have.been.calledWith(1);
      expect(vm.eventDetails).to.deep.equal({ bananas: 1 });
    });
  });

  describe('loadDojo()', () => {
    it('should get the dojo details', async () => {
      // ARRANGE
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.eventDetails = {
        dojoId: 1,
      };
      MockDojoService.getDojoById.resolves({ body: { bananas: 1 } });
      // ACT
      await vm.loadDojo();

      // ASSERT
      expect(MockDojoService.getDojoById).to.have.been.calledWith(1);
      expect(vm.dojoDetails).to.deep.equal({ bananas: 1 });
    });
  });

  describe('next', () => {
    it('should go to the next step', () => {
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.$router = {
        push: sandbox.stub(),
      };
      vm.eventDetails = {
        bananas: 1,
      };
      vm.next();
      expect(vm.$router.push).to.have.been.calledWith({ name: 'EventSessions', params: { eventId: vm.eventId } });
    });
  });
  describe('computed', () => {
    it('redirectionUrl', () => {
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.$route = {
        path: 'somewhere',
      };
      expect(vm.redirectionUrl).to.equal('somewhere');
    });

    it('context', () => {
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.dojoDetails = {
        country: {
          alpha2: 'FR',
        },
      };
      expect(vm.context).to.deep.equal({ country: { alpha2: 'FR' } });
    });
  });
  describe('created', () => {
    it('should load the event and the dojo after the event if the user isnt connected', async () => {
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.loadEvent = sandbox.stub();
      vm.loadDojo = sandbox.stub();
      vm.loadCurrentUser = sandbox.stub().resolves(false);
      await vm.$lifecycleMethods.created();
      expect(vm.loadCurrentUser).to.have.been.calledOnce;
      expect(vm.loadEvent).to.have.been.calledOnce;
      expect(vm.loadDojo).to.have.been.calledOnce;
    });
    it('should redirect to the next page if the user is logged-in', async () => {
      const vm = vueUnitHelper(LoginOrRegisterComponentWithMocks);
      vm.loadEvent = sandbox.stub();
      vm.loadDojo = sandbox.stub();
      vm.loadCurrentUser = sandbox.stub();
      vm.currentUser = { ok: true };
      vm.$router = {
        push: sandbox.stub(),
      };
      await vm.$lifecycleMethods.created();
      expect(vm.loadCurrentUser).to.have.been.calledOnce;
      expect(vm.loadEvent).to.not.have.been.called;
      expect(vm.loadDojo).to.not.have.been.called;
    });
  });
});
