import vueUnitHelper from 'vue-unit-helper';
import DashboardEventsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-events';

describe('Dashboard events component', () => {
  let sandbox;
  let vm;
  let MockDojosService;
  let MockEventsService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventsService = {
      v3: {
        get: sandbox.stub(),
      },
    };
    MockDojosService = {
      getUsersDojos: sandbox.stub(),
      getDojoById: sandbox.stub(),
    };
    vm = vueUnitHelper(DashboardEventsComponent({
      '@/events/service': MockEventsService,
      '@/dojos/service': MockDojosService,
    }));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('usersDojosMap', () => {
      it('should return a mapping of dojoIds to usersDojos', () => {
        vm.usersDojos = [{ dojoId: 'd1', userPermissions: ['banana'] }, { dojoId: 'd2', userPermissions: ['ticketing-admin'] }];
        expect(vm.usersDojosMap).to.deep.equal({ d1: [{ dojoId: 'd1', userPermissions: ['banana'] }], d2: [{ dojoId: 'd2', userPermissions: ['ticketing-admin'] }] });
      });
    });

    describe('ticketingAdmins', () => {
      it('should return the usersdojos where the user has a ticketingAdmin perm', () => {
        vm.usersDojos = [{ dojoId: 'd1', userPermissions: ['banana'] }, { dojoId: 'd2', userPermissions: ['ticketing-admin'] }];
        expect(vm.ticketingAdmins).to.deep.equal([{ dojoId: 'd2', userPermissions: ['ticketing-admin'] }]);
      });
    });
    describe('usesTicketing', () => {
      it('should return true if the dojo uses ticketing', () => {
        vm.oldEvents = [{ id: 'e1' }];
        expect(vm.usesTicketing).to.be.true;
      });
      it('should return false if the dojo doesn\'t use ticketing', () => {
        vm.oldEvents = [];
        expect(vm.usesTicketing).to.be.false;
      });
    });
    describe('maxDojoAge', () => {
      it('should return the maxAge of the user\'s Dojos in years', () => {
        vm.dojos = { d1: { createdAt: new Date().toISOString() } };
        expect(vm.maxDojoAge).to.equal(0);
      });
    });
  });

  describe('methods', () => {
    describe('loadEvents', () => {
      it('should add up all the values for the given field for all tickets of the given type', () => { });
    });
  });
});
