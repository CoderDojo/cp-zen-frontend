import vueUnitHelper from 'vue-unit-helper';
import eventList from '!!vue-loader?inject!@/events/cd-event-list';

describe('Event list component', () => {
  let EventListWithMocks;
  let MockEventsService;
  let MockDojosService;
  let MockUsersService;
  let MockUsersUtil;

  beforeEach(() => {
    MockEventsService = {
      v3: {
        get: sinon.stub(),
      },
    };
    MockDojosService = {
      getUsersDojos: sinon.stub(),
      joinDojo: sinon.stub(),
    };
    MockUsersService = {
      getCurrentUser: sinon.stub(),
      userProfileData: sinon.stub(),
    };
    MockUsersUtil = {
      isYouthOverThirteen: sinon.stub(),
    };
    EventListWithMocks = eventList({
      '@/users/service': MockUsersService,
      '@/users/util': MockUsersUtil,
      '@/dojos/service': MockDojosService,
      './service': MockEventsService,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should show the list of dojo events', async () => {
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

    MockEventsService.v3.get.returns(Promise.resolve({ body: mockEventDataResponse }));
    const vm = vueUnitHelper(EventListWithMocks);
    vm.dojo = { id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77' };
    const res = await vm.loadEvents();
    expect(res.body).to.deep.equal(mockEventDataResponse);
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
        MockUsersService.userProfileData.returns(Promise.resolve({ body: mockUserProfile }));
        const vm = vueUnitHelper(EventListWithMocks);
        vm.currentUser = {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
        };
        // ACT
        vm.loadUsersProfile();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersProfile).to.equal(mockUserProfile);
          done();
        });
      });
    });
    describe('loadUserDojoRole', () => {
      it('should return the current user\'s dojo', (done) => {
        const vm = vueUnitHelper(EventListWithMocks);
        const mockDojoData = [{ userId: 1, dojoId: 1 }];
        vm.currentUser = {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
        };
        vm.dojo = {
          id: 'p4j8h55b-v3fw-gb4f-00gq-847bw5ctlme2',
        };
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: mockDojoData }));

        // ACT
        vm.loadUserDojoRole();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersDojos).to.deep.equal(mockDojoData);
          done();
        });
      });
    });
    describe('loadEvents', () => {
      it('should load the dojo events', async () => {
        // ARRANGE
        const mockEvents = [{ id: '1', name: 'Event' }];
        MockEventsService.v3.get.returns(Promise.resolve({ body: mockEvents }));
        const vm = vueUnitHelper(EventListWithMocks);
        vm.dojo = {
          id: 'p4j8h55b-v3fw-gb4f-00gq-847bw5ctlme2',
        };
        // ACT
        const res = await vm.loadEvents();

        // ASSERT
        expect(res.body).to.deep.equal(mockEvents);
        expect(MockEventsService.v3.get).to.have.been.calledWith(vm.dojo.id, {
          params: {
            query: {
              afterDate: sinon.match.number,
              utcOffset: -(new Date()).getTimezoneOffset(),
              status: 'published',
            },
            related: 'sessions.tickets',
          },
        });
      });
      it('should load the dojo past events', async () => {
        // ARRANGE
        const mockEvents = [{ id: '1', name: 'Event' }];
        MockEventsService.v3.get.returns(Promise.resolve({ body: mockEvents }));
        const vm = vueUnitHelper(EventListWithMocks);
        vm.dojo = {
          id: 'p4j8h55b-v3fw-gb4f-00gq-847bw5ctlme2',
        };
        // ACT
        const res = await vm.loadEvents(true);

        // ASSERT
        expect(res.body).to.deep.equal(mockEvents);
        expect(MockEventsService.v3.get).to.have.been.calledWith(vm.dojo.id, {
          params: {
            query: {
              beforeDate: sinon.match.number,
              afterDate: sinon.match.number,
              utcOffset: -(new Date()).getTimezoneOffset(),
              status: 'published',
            },
            orderBy: 'startTime',
            direction: 'desc',
            page: 1,
            pageSize: 1,
          },
        });
      });
    });
    describe('joinTheDojo', () => {
      it('should join the current user to the dojo as an o13', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(EventListWithMocks);
        const mockUserType = 'attendee-o13';
        const mockDobDate = new Date((new Date().getFullYear() - 15).toString()).toISOString();
        MockUsersUtil.isYouthOverThirteen.returns(true);
        MockDojosService.joinDojo.returns(Promise.resolve());
        vm.usersProfile = {
          dob: mockDobDate,
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
          expect(MockUsersUtil.isYouthOverThirteen).to.have.been.calledWith(new Date(mockDobDate));
          expect(MockDojosService.joinDojo).to.have.been.calledWith(
            vm.currentUser.id,
            vm.dojo.id,
            [mockUserType]);
          expect(MockDojosService.getUsersDojos).to.have.been.calledWith(vm.currentUser.id);
          done();
        });
      });
      it('should join the current user to the dojo as a parent', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(EventListWithMocks);
        const mockUserType = 'parent-guardian';
        const mockDobDate = new Date((new Date().getFullYear() - 20).toString()).toISOString();
        MockUsersUtil.isYouthOverThirteen.returns(false);
        MockDojosService.joinDojo.returns(Promise.resolve());
        vm.usersProfile = {
          dob: mockDobDate,
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
          expect(MockUsersUtil.isYouthOverThirteen).to.have.been.calledWith(new Date(mockDobDate));
          expect(MockDojosService.joinDojo).to.have.been.calledWith(
            vm.currentUser.id,
            vm.dojo.id,
            [mockUserType]);
          expect(MockDojosService.getUsersDojos).to.have.been.calledWith(vm.currentUser.id);
          done();
        });
      });

      it('should redirect to the login page', (done) => {
        const vm = vueUnitHelper(EventListWithMocks);
        vm.joinTheDojo();
        expect(MockDojosService.joinDojo).not.to.have.been.called;
        done();
      });
    });
  });

  describe('computed', () => {
    describe('noEventsContent', () => {
      it('should set the content when past events exists and the user is not joined', () => {
        const vm = vueUnitHelper(eventList());
        vm.isDojoMember = false;
        const content = vm.noEventsContent;
        expect(content).to.equal('This Dojo had events recently. Join the Dojo to get notified when tickets for the next event are available.');
      });
      it('should set the content when past events exists and the user is joined', () => {
        const vm = vueUnitHelper(eventList());
        vm.isDojoMember = true;
        const content = vm.noEventsContent;
        expect(content).to.equal('This Dojo had events recently. You\'ll be notified when tickets for the next event are available.');
      });
    });
    describe('hasPastEvents', () => {
      it('should return if it has past events', () => {
        const vm = vueUnitHelper(EventListWithMocks);
        vm.pastEvents = [];
        expect(vm.hasPastEvents).to.be.false;
      });
      it('should return if it has past events', () => {
        const vm = vueUnitHelper(EventListWithMocks);
        vm.pastEvents = [{}];
        expect(vm.hasPastEvents).to.be.true;
      });
    });
    describe('hasFutureEvents', () => {
      it('should return if it has future events', () => {
        const vm = vueUnitHelper(EventListWithMocks);
        vm.futureEvents = [];
        expect(vm.hasFutureEvents).to.be.false;
      });
      it('should return if it has future events', () => {
        const vm = vueUnitHelper(EventListWithMocks);
        vm.futureEvents = [{}];
        expect(vm.hasFutureEvents).to.be.true;
      });
    });
    describe('isDojoMember', () => {
      it('should be true when there is a joined user', (done) => {
        const vm = vueUnitHelper(eventList());
        vm.currentUser = {
          id: 1,
        };
        vm.usersDojos = [{ smthg: 'smthg' }];
        expect(vm.isDojoMember).to.be.true;
        done();
      });
      it('should be false when the user is not joined', (done) => {
        const vm = vueUnitHelper(eventList());
        vm.currentUser = {
          id: 1,
        };
        vm.usersDojos = [];
        expect(vm.isDojoMember).to.be.false;
        done();
      });
      it('should be false when there is no user logged in', (done) => {
        const vm = vueUnitHelper(eventList());
        vm.currentUser = {};
        vm.usersDojos = [];
        expect(vm.isDojoMember).to.be.false;
        done();
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
        vm.currentUser = {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
        };
      });
      it('should update userProfile and DojoRole if there is a currentUser', (done) => {
        // ARRANGE
        sinon.stub(vm, 'loadUserDojoRole').returns(Promise.resolve());
        sinon.stub(vm, 'loadUsersProfile').returns(Promise.resolve());
        // ACT
        vm.$watchers.currentUser('foo');

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.loadUserDojoRole).to.have.been.calledOnce;
          expect(vm.loadUsersProfile).to.have.been.calledOnce;
          done();
        });
      });
    });
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('should load user and event data', () => {
        // ARRANGE
        const vm = vueUnitHelper(eventList());
        sinon.stub(vm, 'loadEvents').resolves({ body: [] });
        sinon.stub(vm, 'loadCurrentUser');
        MockUsersService.getCurrentUser.returns({ body: { user: { id: '34174952-8ca4-4189-b8cb-d383e3fde992' } } });
        vm.dojo = { verified: 1 };
        // ACT
        vm.$lifecycleMethods.created();

        // ASSERT
        expect(vm.loadEvents).to.have.been.calledTwice;
        expect(vm.loadCurrentUser).to.have.been.calledOnce;
      });
      it('shouldnt load event data', () => {
        // ARRANGE
        const vm = vueUnitHelper(eventList());
        sinon.stub(vm, 'loadEvents');
        sinon.stub(vm, 'loadCurrentUser');
        vm.dojo = { verified: 0 };
        MockUsersService.getCurrentUser.returns({ body: { user: { id: '34174952-8ca4-4189-b8cb-d383e3fde992' } } });
        // ACT
        vm.$lifecycleMethods.created();

        // ASSERT
        expect(vm.loadEvents).not.to.have.been.called;
        expect(vm.loadCurrentUser).to.have.been.called;
      });
    });
  });
});
