import vueUnitHelper from 'vue-unit-helper';
import eventList from '!!vue-loader?inject!@/events/cd-event-list';

describe('Event list component', () => {
  let sandbox;
  let EventListWithMocks;
  let MockEventsService;
  let MockDojosService;
  let MockUsersService;
  let MockUsersUtil;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventsService = {
      loadEvents: sandbox.stub(),
    };
    MockDojosService = {
      getUsersDojos: sandbox.stub(),
      joinDojo: sandbox.stub(),
    };
    MockUsersService = {
      getCurrentUser: sandbox.stub(),
      userProfileData: sandbox.stub(),
    };
    MockUsersUtil = {
      isYouthOverThirteen: sandbox.stub(),
    };
    EventListWithMocks = eventList({
      '@/users/service': MockUsersService,
      '@/users/util': MockUsersUtil,
      '@/dojos/service': MockDojosService,
      './service': MockEventsService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should show the list of dojo events', (done) => {
    const mockEventDataResponse = [
      {
        id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
        name: 'My First Amazing Event',
        dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
        dates: [
          {
            startTime: '2017-06-06T16:30:00.000Z',
            endTime: '2017-06-06T18:00:00.000Z',
          },
        ],
      },
      {
        id: '34174952-8ca4-4189-b8cb-d383e3fde992',
        name: 'My Second Amazing Event',
        dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
        dates: [
          {
            startTime: '2017-06-06T16:30:00.000Z',
            endTime: '2017-06-06T18:00:00.000Z',
          },
        ],
      },
    ];

    MockEventsService.loadEvents.returns(Promise.resolve({ body: mockEventDataResponse }));
    const vm = vueUnitHelper(EventListWithMocks);
    vm.dojo = { id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77' };
    vm.loadEvents();
    requestAnimationFrame(() => {
      expect(vm.events).to.deep.equal(mockEventDataResponse);
      done();
    });
  });

  describe('methods', () => {
    describe('loadCurrentUser', () => {
      it('should load the current user', (done) => {
        // ARRANGE
        const mockUser = {
          id: 'foo',
        };
        MockUsersService.getCurrentUser.returns(Promise.resolve({ body: { user: mockUser } }));
        const vm = vueUnitHelper(EventListWithMocks);

        // ACT
        vm.loadCurrentUser();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.currentUser).to.deep.equal(mockUser);
          done();
        });
      });
    });

    describe('loadUsersProfile', () => {
      it('should load the current user\'s profile', (done) => {
        // ARRANGE
        const mockUserProfile = {
          dob: '2000-10-26T00:00:00.000Z',
        };
        MockUsersService.userProfileData.returns(Promise.resolve({ body: mockUserProfile }))
        const vm = vueUnitHelper(EventListWithMocks);

        // ACT
        vm.loadUsersProfile();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersProfile).to.equal(mockUserProfile);
          done();
        });
      });
    });

    describe('joinTheDojo', () => {
      it('should join the current user to the dojo with their correct user type', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(EventListWithMocks);
        const mockUserType = 'attendee-o13';
        const mockDobDate = new Date('2000-10-26T00:00:00.000Z');
        MockUsersUtil.isYouthOverThirteen.returns(true);
        MockDojosService.joinDojo.returns(Promise.resolve());
        vm.usersProfile = {
          dob: '2000-10-26T00:00:00.000Z',
        };
        vm.currentUser = {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
        };
        vm.dojo = {
          id: 'p4j8h55b-v3fw-gb4f-00gq-847bw5ctlme2',
        };

        // ACT
        vm.joinTheDojo();

        // ASSERT
        requestAnimationFrame(() => {
          expect(MockUsersUtil.isYouthOverThirteen).to.have.been.calledWith(mockDobDate);
          expect(MockDojosService.joinDojo).to.have.been.calledWith(vm.currentUser.id, vm.dojo.id, [mockUserType]);
          done();
        });
      });
    });
  });

  describe('watch', () => {
    describe('currentUser', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(EventListWithMocks);
        vm.dojo = {
          id: 'dojo',
        };
      });

      it('should update usersDojos if the new currentUser is a member of the dojo', (done) => {
        // ARRANGE
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: ['foo'] }));

        // ACT
        vm.$watchers.currentUser('foo');

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersDojos).to.deep.equal(['foo']);
          done();
        });
      });
    });
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('should load user, profile and event data', () => {
        // ARRANGE
        const vm = vueUnitHelper(eventList());
        sandbox.stub(vm, 'loadEvents');
        sandbox.stub(vm, 'loadCurrentUser');
        sandbox.stub(vm, 'loadUsersProfile');

        // ACT
        vm.$lifecycleMethods.created();

        // ASSERT
        expect(vm.loadEvents).to.have.been.calledOnce;
        expect(vm.loadCurrentUser).to.have.been.calledOnce;
        expect(vm.loadUsersProfile).to.have.been.calledOnce;
      });
    });
  });
});
