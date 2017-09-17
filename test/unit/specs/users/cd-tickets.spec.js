import vueUnitHelper from 'vue-unit-helper';
import ticketList from '!!vue-loader?inject!@/users/cd-tickets';

describe('Events/Tickets list component', () => {
  let sandbox;
  let TicketListWithMocks;
  let MockEventsService;
  let MockDojosService;
  let MockUsersService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockEventsService = {
      loadEvents: sandbox.stub(),
    };
    MockDojosService = {
      getUsersDojos: sandbox.stub(),
    };
    MockUsersService = {
      getCurrentUser: sandbox.stub(),
      getChildren: sandbox.stub(),
    };
    TicketListWithMocks = ticketList({
      '@/events/service': MockEventsService,
      '@/dojos/service': MockDojosService,
      '@/users/service': MockUsersService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('methods', () => {
    describe('loadCurrentUser', () => {
      it('should load the current user', (done) => {
        // ARRANGE
        const mockUser = {
          id: 'foo',
        };
        MockUsersService.getCurrentUser.returns(Promise.resolve({ body: { user: mockUser } }));
        const vm = vueUnitHelper(TicketListWithMocks);

        // ACT
        vm.loadCurrentUser();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.currentUser).to.deep.equal(mockUser);
          done();
        });
      });
    });
    describe('loadEvents', () => {
      it('should load the user\'s events', (done) => {
        // ARRANGE
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
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };
        vm.usersDojos = [{dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77'}];
        const mockEventDataTransformed = _.map(mockEventDataResponse, (event, index) => {event.dojo = vm.usersDojos[0]; return event;});
        // ACT
        vm.loadEvents();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.events).to.deep.equal(mockEventDataTransformed);
          done();
        });
      });
    });
    describe('loadUserDojos', () => {
      it('should load the user\'s dojos relationship', (done) => {
        // ARRANGE
        const mockUserDojoData = [{id: 'foobar', dojoId: 'bar', userId: 'foo'}];
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: mockUserDojoData }));
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };

        // ACT
        vm.loadUserDojos();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersDojos).to.deep.equal(mockUserDojoData);
          done();
        });
      });
    });
    describe('loadUsersChildren', () => {
      it('should load the user\'s children', (done) => {
        // ARRANGE
        const mockUserChildrenData = [{userId: '1'}, {userId: '2'}];
        MockUsersService.getChildren.returns(Promise.resolve({ body: mockUserChildrenData }));
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };
        const mockUserChildrenTransformed = {foo: {id: 'foo'}, 1:{userId: '1'}, 2: {userId: '2'}};

        // ACT
        vm.loadUsersChildren();

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.users).to.deep.equal(mockUserChildrenTransformed);
          done();
        });
      });
    });
  });
});
