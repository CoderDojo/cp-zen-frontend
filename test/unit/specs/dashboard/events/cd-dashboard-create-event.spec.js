import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment';
import DashboardCreateEventComponent from '!!vue-loader?inject!@/dashboard/events/cd-dashboard-create-event';

describe('Dashboard create event component', () => {
  let vm;

  beforeEach(() => {
    vm = vueUnitHelper(DashboardCreateEventComponent());
  });

  afterEach(() => {
    sinon.restore();
  });


  describe('computed', () => {
    describe('maxDojoAge', () => {
      it('should return the maxAge of the user\'s Dojos in years', () => {
        vm.dojos = { d1: { created: (moment().subtract(1, 'years')).format() } };
        vm.ticketingAdmins = [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }];
        expect(vm.maxDojoAge).to.equal(1);
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

    describe('getTicketingAdminUrl', () => {
      it('should return the url to event form if the user is a ticketingAdmin', () => {
        // ARRANGE
        vm.ticketingAdmins = [{ dojoId: 'd1' }];

        // ASSERT
        expect(vm.getTicketingAdminUrl).to.equal('dashboard/dojos/d1/events/new');
      });
      it('should return the url to my-dojos if the user is not a ticketing-admin', () => {
        // ARRANGE
        vm.ticketingAdmins = [];

        // ASSERT
        expect(vm.getTicketingAdminUrl).to.equal('dashboard/my-dojos');
      });
    });
  });

  describe('methods', () => {
    describe('dojoAge', () => {
      it('should should return the age of the dojo', async () => {
        const lastYear = (new Date()).setFullYear(new Date().getFullYear() - 1);
        // ASSERT
        const res = vm.dojoAge({ created: lastYear }, 'years');
        expect(res).to.equal(1);
      });
    });
  });
});
