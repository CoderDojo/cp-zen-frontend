import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment';
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
        vm.usersDojos = [{ dojoId: 'd1', userPermissions: [{ name: 'banana' }] }, { dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }];
        expect(vm.usersDojosMap).to.deep.equal({ d1: [{ dojoId: 'd1', userPermissions: [{ name: 'banana' }] }], d2: [{ dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }] });
      });
    });

    describe('ticketingAdmins', () => {
      it('should return the usersdojos where the user has a ticketingAdmin perm', () => {
        vm.usersDojos = [{ dojoId: 'd1', userPermissions: [{ name: 'banana' }] }, { dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }];
        expect(vm.ticketingAdmins).to.deep.equal([{ dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }]);
      });
    });
    describe('dojoAdmins', () => {
      it('should return the usersdojos where the user has a dojoAdmin perm', () => {
        vm.usersDojos = [{ dojoId: 'd1', userPermissions: [{ name: 'banana' }] }, { dojoId: 'd2', userPermissions: [{ name: 'dojo-admin' }] }];
        expect(vm.dojoAdmins).to.deep.equal([{ dojoId: 'd2', userPermissions: [{ name: 'dojo-admin' }] }]);
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
    describe('hasDojos', () => {
      it('should return true if the object contains keys', () => {
        vm.dojos = { d1: { dojoId: 'd1' } };
        expect(vm.hasDojos).to.be.true;
      });
      it('should return false if the object is empty', () => {
        vm.dojos = {};
        expect(vm.hasDojos).to.be.false;
      });
    });
    describe('maxDojoAge', () => {
      it('should return the maxAge of the user\'s Dojos in years', () => {
        vm.dojos = { d1: { createdAt: (moment().subtract(1, 'years')).format() } };
        vm.hasDojos = true;
        vm.ticketingAdmins = [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }];
        expect(vm.maxDojoAge).to.equal(1);
      });
      it('should return 0 when the dojos are not loaded yet', () => {
        vm.hasDojos = false;
        expect(vm.maxDojoAge).to.equal(0);
      });
    });
    describe('firstDojo', () => {
      it('should return the first Dojo you\'re a dojo-admin', () => {
        vm.dojos = { d1: { dojoId: 'd1', name: 'dojo1' } };
        vm.dojoAdmins = [{ dojoId: 'd1' }];
        vm.hasDojos = true;
        expect(vm.firstDojo).to.eql({ dojoId: 'd1', name: 'dojo1' });
      });
      it('should return the first Dojo you\'re a dojo-admin', () => {
        vm.dojos = {};
        vm.dojoAdmins = [{ dojoId: 'd1' }];
        vm.hasDojos = false;
        expect(vm.firstDojo).to.eql({});
      });
    });
  });

  describe('methods', () => {
    describe('loadEvents', () => {
      it('should add up all the values for the given field for all tickets of the given type', () => { });
    });
  });
});
