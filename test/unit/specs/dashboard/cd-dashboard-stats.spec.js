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
          perc: 50,
          prevValue: 50,
        }];
        expect(vm.genderStats).to.deep.equal(expectedData);
      });
    });
  });

  describe('methods', () => {
    describe('getDojos', () => {
      it('should load the users Dojos into dojos and define the current DojoId as the first Dojo', async () => {
        // ARRANGE
        const mockUserDojos = [{ dojoId: 'd1', userId: 'u1', userTypes: ['champion'] }];
        MockDojoService.getUsersDojos.resolves({ body: mockUserDojos });
        vm.loggedInUser = { id: 'u1' };
        // ACT
        await vm.getDojos();

        // ASSERT
        expect(MockDojoService.getUsersDojos).to.have.been.calledOnce;
        expect(MockDojoService.getUsersDojos).to.have.been.calledWith('u1');

        expect(vm.dojos).to.deep.equal(mockUserDojos);
        expect(vm.dojoId).to.equal('d1');
      });
      it('should load the users Dojos into dojos and define the current DojoId as null', async () => {
        // ARRANGE
        const mockUserDojos = [{ dojoId: 'd1', userId: 'u1', userTypes: ['banana'] }];
        MockDojoService.getUsersDojos.resolves({ body: mockUserDojos });
        vm.loggedInUser = { id: 'u1' };
        // ACT
        await vm.getDojos();

        // ASSERT
        expect(MockDojoService.getUsersDojos).to.have.been.calledOnce;
        expect(MockDojoService.getUsersDojos).to.have.been.calledWith('u1');

        expect(vm.dojos).to.deep.equal([]);
        expect(vm.dojoId).to.equal(null);
      });
    });
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
          { deleted: 0, ticketType: 'ninja', status: { ne$: 'cancelled' } },
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
      sandbox.stub(vm, 'getDojos');
      sandbox.stub(vm, 'getBookedChildren');
      sandbox.stub(vm, 'getDojoUsers');

      // ACT
      await vm.$lifecycleMethods.created();

      // ASSERT
      expect(vm.getDojos).to.have.been.calledOnce;
      expect(vm.getBookedChildren).to.have.been.calledOnce;
      expect(vm.getDojoUsers).to.have.been.calledOnce;
    });
  });
});
