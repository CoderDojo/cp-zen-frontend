import vueUnitHelper from 'vue-unit-helper';
import moment from 'moment';
import DashboardDojoAnniversary from '!!vue-loader?inject!@/dashboard/cd-dashboard-dojo-anniversary';

describe('Dashboard dojo anniversary component', () => {
  let sandbox;
  let vm;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    vm = vueUnitHelper(DashboardDojoAnniversary({
    }));
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });


  describe('methods', () => {
    describe('hasAnniversary', () => {
      it('should return true if the creation date is less than 2 months from now', () => {
        clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
        const created = moment();
        created.add(1, 'months');
        expect(vm.hasAnniversary({ created })).to.be.true;
      });
      it('should return false if the creation date is more than 2 months from now', () => {
        clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
        const created = moment();
        created.add(3, 'months');
        expect(vm.hasAnniversary({ created })).to.be.false;
      });
      it('should return false if the creation date is past', () => {
        clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
        const created = moment();
        created.subtract(1, 'days');
        expect(vm.hasAnniversary({ created })).to.be.false;
      });
      it('should return true if anniversary is within 2 months and next year', () => {
        clock = sinon.useFakeTimers(new Date(2018, 11, 12, 0, 0, 0, 0));
        const created = moment();
        created.add(1, 'months');
        expect(vm.hasAnniversary({ created })).to.be.true;
      });
    });
    describe('isOld', () => {
      it('should return true if the dojo is at least 10 month old', () => {
        clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
        const created = moment();
        created.subtract(11, 'month');
        expect(vm.isOld({ created })).to.be.true;
      });
      it('should return false if the dojo is less than 10 month old', () => {
        clock = sinon.useFakeTimers(new Date(2018, 3, 24, 0, 0, 0, 0));
        const created = moment();
        created.subtract(9, 'month');
        expect(vm.isOld({ created })).to.be.false;
      });
    });
    describe('championOfDojos', () => {
      it('should filter all dojos where the user is not an admin', () => {
        const dojos = { d1: { name: 'd1' }, d2: { name: 'd2' } };
        const dojoAdmins = [{ dojoId: 'd2' }, { dojoId: 'd3' }];
        const res = vm.championOfDojos(dojos, dojoAdmins);
        expect(res).to.eql([{ name: 'd2' }]);
      });
    });
    describe('dojosWithUpcomingAnniversary', () => {
      it('should return dojos which are not old enough and not near their anniversary', () => {
        vm.hasAnniversary = sandbox.stub().onCall(0).returns(true);
        vm.isOld = sandbox.stub().onCall(0).returns(true);
        // Dojo 2
        vm.hasAnniversary.onCall(1).returns(false);
        // Dojo 3
        vm.hasAnniversary.onCall(2).returns(true);
        vm.isOld.onCall(1).returns(false);
        const dojos = [{ id: 'd1' }, { id: 'd2' }, { id: 'd3' }];
        expect(vm.dojosWithUpcomingAnniversary(dojos)).to.eql([{ id: 'd1' }]);
      });
    });
    describe('formUrl', () => {
      it('should return the url of the form with its variables pre-filled', () => {
        vm.baseUrl = 'https://zen.coderdojo.com';
        const url = vm.formUrl({ name: 'd1', urlSlug: 'ie/dublin/dublin/dublin-docklands-chq' });
        expect(url).to.equal('https://docs.google.com/forms/d/e/1FAIpQLScNDxfs7MP4aOA9f8iZPTuNl6NVO2RHpIch5VGwUDiupaGOxA/viewform?entry.803640143=d1&entry.2104926148=https://zen.coderdojo.com/dojos/ie/dublin/dublin/dublin-docklands-chq');
      });
    });
  });
  describe('lifecycle', () => {
    describe('created', () => {
      it('should prepare the dojos', () => {
        vm.championOfDojos = sandbox.stub().returns([{ id: 'd1' }]);
        vm.dojosWithUpcomingAnniversary = sandbox.stub().returns([{ id: 'd1' }]);
        vm.$lifecycleMethods.created();
        expect(vm.championOfDojos).to.have.been.calledOnce;
        expect(vm.dojosWithUpcomingAnniversary).to.have.been.calledOnce;
        expect(vm.filteredDojos).to.eql([{ id: 'd1' }]);
      });
    });
  });
});
