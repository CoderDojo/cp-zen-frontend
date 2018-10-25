import vueUnitHelper from 'vue-unit-helper';
import DashboardProjectsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-stats';

describe('Dashboard stats component', () => {
  let sandbox;
  let DashboardProjectsComponentWithMocks;
  let MockDojoService;
  let MockEventService;
  let vm;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojoService = {
      getUsersDojos: sandbox.stub(),
      getDojoUsers: sandbox.stub(),
    };
    MockEventService = {
      searchApplicationsByDojo: sandbox.stub(),
    };
    DashboardProjectsComponentWithMocks = DashboardProjectsComponent({
      '@/dojos/service': MockDojoService,
      '@/events/service': MockEventService,
    });
    vm = vueUnitHelper(DashboardProjectsComponentWithMocks);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('femaleHintIsVisible', () => {
      it('should return true', () => {
        vm.genderStats = [{ name: 'Female', perc: 20 }];
        expect(vm.femaleHintIsVisible).to.be.true;
      });
      it('should return false', () => {
        vm.genderStats = [{ name: 'Female', perc: 31 }];
        expect(vm.femaleHintIsVisible).to.be.false;
      });
      it('should return true if not found', () => {
        vm.genderStats = [];
        expect(vm.femaleHintIsVisible).to.be.true;
      });
    });
    describe('totalChildren', () => {
      it('should return the length of userDojos', () => {
        vm.dojoUsers = [{}, {}];
        expect(vm.totalChildren).to.equal(2);
      });
      it('should return 1 if userDojos is falsy', () => {
        vm.dojoUsers = null;
        expect(vm.totalChildren).to.equal(1);
      });
    });
    describe('genderStats', () => {
      it('should return an array containing the info to generate the pie chart', () => {
        vm.totalChildren = 2;
        vm.genders = { Male: 1, Female: 1 };
        const expectedData = [{
          nb: 1,
          name: 'Male',
          perc: 50,
          prevValue: 0,
        }, {
          nb: 1,
          name: 'Female',
          perc: 51,
          prevValue: 50,
        }];
        expect(vm.genderStats).to.deep.equal(expectedData);
      });
    });
    describe('dojoId', () => {
      it('should return the first dojoId from the usersDojos', () => {
        vm.userDojos = [{ dojoId: 'd1' }, { dojoId: 'd2' }];
        expect(vm.dojoId).to.equal('d1');
      });
      it('should return null when usersDojos doesn\'t exists', () => {
        vm.userDojos = [];
        expect(vm.dojoId).to.be.null;
      });
    });
  });

  describe('methods', () => {
    describe('getBookedChildren', () => {
      it('should load the dojos applications', async () => {
        // ARRANGE
        const mockApplications = [{ id: 'a1', ticketType: 'ninja' }];
        MockEventService.searchApplicationsByDojo.resolves({ body: mockApplications });
        vm.dojoId = 'd1';
        // ACT
        await vm.getBookedChildren();

        // ASSERT
        expect(MockEventService.searchApplicationsByDojo).to.have.been.calledOnce;
        expect(MockEventService.searchApplicationsByDojo).to.have.been.calledWith(
          'd1',
          { deleted: false, ticketType: 'ninja', status: { ne$: 'cancelled' } },
        );
        expect(vm.bookedChildren).to.equal(1);
      });
    });
    describe('getDojoUsers', () => {
      it('should set dojoUsers & genders', async () => {
        vm.dojoId = 'd1';
        MockDojoService.getDojoUsers.resolves({ body: { response: [
          { gender: 'Female' },
          { gender: 'Male' },
          { gender: null },
          { gender: 'Undisclosed' },
        ] } });

        await vm.getDojoUsers();

        expect(MockDojoService.getDojoUsers).to.have.been.calledTwice;
        expect(MockDojoService.getDojoUsers.getCall(0).args).to.deep.equal(['d1',
          { userType: 'attendee-u13',
            fields: ['gender'],
          },
        ]);
        expect(MockDojoService.getDojoUsers.getCall(1).args).to.deep.equal(['d1',
          { userType: 'attendee-o13',
            fields: ['gender'],
          },
        ]);
        expect(vm.dojoUsers).to.deep.eq([
          { gender: 'Female' },
          { gender: 'Male' },
          { gender: null },
          { gender: 'Undisclosed' },
          { gender: 'Female' },
          { gender: 'Male' },
          { gender: null },
          { gender: 'Undisclosed' },
        ]);
        expect(vm.genders).to.deep.eq({
          Female: 2,
          Male: 2,
          Undisclosed: 4,
        });
      });
    });
  });

  describe('created', () => {
    it('should call getDojos && getBookedChildren && getDojoUsers', async () => {
      // ARRANGE
      sandbox.stub(vm, 'getBookedChildren');
      sandbox.stub(vm, 'getDojoUsers');

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.getBookedChildren).to.have.been.calledOnce;
      expect(vm.getDojoUsers).to.have.been.calledOnce;
    });
  });
});
