import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment'; // eslint-disable-line no-unused-vars
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

    describe('userIsNew', () => {
      it('should return true if the user is less than 3 months old', () => {
        vm.loggedInUser = { when: new Date() };
        expect(vm.userIsNew).to.be.true;
      });
      it('should return false if the user is 3months + old', () => {
        const createdAt = moment().add(-3, 'months');
        vm.loggedInUser = { when: createdAt };
        expect(vm.userIsNew).to.be.false;
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
