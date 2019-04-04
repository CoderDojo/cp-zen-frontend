import vueUnitHelper from 'vue-unit-helper';
import cdManageRequestToJoin from '!!vue-loader?inject!@/dojos/manage-request-to-join';

describe('Manage request to join component', () => {
  let vm;
  let sandbox;
  let DojosService;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  beforeEach(() => {
    DojosService = {
      membership: {
        loadPending: sandbox.stub(),
        accept: sandbox.stub(),
        refuse: sandbox.stub(),
      },
    };
    vm = vueUnitHelper(cdManageRequestToJoin({
      '@/dojos/service': DojosService,
    }));
    vm.$route = {
      params: {},
    };
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('computed', () => {
    describe('text', () => {
      it('should return a message depending on the usertype', () => {
        vm.ready = true;
        vm.status = 'accept';
        vm.userTypeString = 'bla';
        expect(vm.text).to.equal('bla');
      });
      it('should return a different text when accepted', () => {
        vm.ready = false;
        vm.status = 'accept';
        expect(vm.text).to.equal('Accepting the user...');
      });
      it('should return a WIP text when refusing', () => {
        vm.ready = true;
        vm.status = 'refuse';
        expect(vm.text).to.equal('The request to join your Dojo has been refused.');
      });
      it('should return a different text when refused', () => {
        vm.ready = false;
        vm.status = 'refuse';
        expect(vm.text).to.equal('Refusing this user from joining your Dojo...');
      });
      it('should return a different text when invalid', () => {
        vm.ready = false;
        vm.status = 'somethingelse';
        expect(vm.text).to.equal('Invalid action, try again or contact support.');
      });
    });
    describe('userTypeString', () => {
      it('should return the mentor string', () => {
        vm.membershipRequest = {
          userType: 'mentor',
        };
        expect(vm.userTypeString).to.equal('The user is now a mentor for your Dojo. This means they can now book mentor tickets and check in users to your events.');
      });
      it('should return the mentor string', () => {
        vm.membershipRequest = {
          userType: 'champion',
        };
        expect(vm.userTypeString).to.equal('The user is now a champion for your Dojo. This means they can now create events, modify the Dojo page and award badges.');
      });
    });
  });
  describe('methods', () => {
    describe('onError', () => {
      it('should set the visibility of the loader to false', () => {
        vm.onError();
        expect(vm.loaderIsVisible).to.be.false;
      });
    });
    describe('loadMembershipRequest', () => {
      it('should assign the membership request to the component', async () => {
        vm.requestId = 'rq1';
        vm.dojoId = 'd1';
        DojosService.membership.loadPending.resolves({ body: { id: 'rq1' } });
        await vm.loadMembershipRequest();
        expect(DojosService.membership.loadPending).to.have.been.calledOnce
          .and.calledWith('rq1', 'd1');
        expect(vm.membershipRequest).to.eql({ id: 'rq1' });
      });
      it('should call onError', async () => {
        DojosService.membership.loadPending.rejects();
        vm.onError = sandbox.stub();
        await vm.loadMembershipRequest();
        expect(DojosService.membership.loadPending).to.have.been.calledOnce;
        expect(vm.onError).to.have.been.calledOnce;
        expect(vm.membershipRequest).to.be.null;
      });
    });
    describe('actOnMembershipRequest', () => {
      it('should accept the membership', async () => {
        vm.status = 'accept';
        vm.requestId = 'rq1';
        vm.dojoId = 'd1';
        await vm.actOnMembershipRequest();
        expect(DojosService.membership.accept).to.have.been.calledOnce
          .and.calledWith('rq1', 'd1');
      });
      it('should refuse the membership', async () => {
        vm.status = 'refuse';
        vm.requestId = 'rq1';
        vm.dojoId = 'd1';
        await vm.actOnMembershipRequest();
        expect(DojosService.membership.refuse).to.have.been.calledOnce
          .and.calledWith('rq1', 'd1');
      });
      it('should call onError if the status is invalid', async () => {
        vm.onError = sandbox.stub();
        vm.status = 'banana';
        await vm.actOnMembershipRequest();
        expect(DojosService.membership.accept).to.not.have.been.called;
        expect(DojosService.membership.refuse).to.not.have.been.called;
        expect(vm.onError).to.have.been.calledOnce;
        expect(vm.errorText).to.be.empty;
      });
      it('should call onError if rejected', async () => {
        DojosService.membership.accept.rejects();
        vm.onError = sandbox.stub();
        vm.status = 'accept';
        await vm.actOnMembershipRequest();
        expect(DojosService.membership.accept).to.have.been.calledOnce;
        expect(vm.onError).to.have.been.calledOnce;
        expect(vm.errorText).to.be.empty;
      });
      it('should set an error message if the user exists', async () => {
        const err = new Error();
        err.status = 400;
        DojosService.membership.accept.rejects(err);
        vm.onError = sandbox.stub();
        vm.status = 'accept';
        await vm.actOnMembershipRequest();
        expect(DojosService.membership.accept).to.have.been.calledOnce;
        expect(vm.onError).to.have.been.calledOnce;
        expect(vm.errorText).to.equal('This user is already part of your Dojo, please go to your {openLink}Dojo\'s user management page{closeLink} to change the user\'s role.');
      });
    });
  });
  describe('lifecycle', () => {
    it('should load the membership and act on it', async () => {
      vm.loadMembershipRequest = sandbox.stub().resolves();
      vm.actOnMembershipRequest = sandbox.stub().resolves();
      vm.membershipRequest = { id: 'rq1' };
      await vm.$lifecycleMethods.created();
      expect(vm.loadMembershipRequest).to.have.been.calledOnce;
      expect(vm.actOnMembershipRequest).to.have.been.calledOnce;
    });
    it('should try to load the membership', async () => {
      vm.loadMembershipRequest = sandbox.stub().resolves();
      vm.membershipRequest = null;
      await vm.$lifecycleMethods.created();
      expect(vm.loadMembershipRequest).to.have.been.calledOnce;
      expect(vm.loaderIsVisible).to.be.false;
    });
  });
});
