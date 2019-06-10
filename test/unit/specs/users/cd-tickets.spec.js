import vueUnitHelper from 'vue-unit-helper';
import ticketList from '!!vue-loader?inject!@/users/cd-tickets';

describe('Events/Tickets list component', () => {
  let TicketListWithMocks;
  let MockEventsService;
  let MockEventsUtil;
  let MockDojosService;
  let MockUsersService;

  beforeEach(() => {
    MockEventsService = {
      v3: {
        get: sinon.stub(),
      },
    };
    MockEventsUtil = {
      orderByStartTime: sinon.stub(),
    };
    MockDojosService = {
      getUsersDojos: sinon.stub(),
    };
    MockUsersService = {
      getCurrentUser: sinon.stub(),
      getChildren: sinon.stub(),
    };
    TicketListWithMocks = ticketList({
      '@/events/service': MockEventsService,
      '@/events/util': MockEventsUtil,
      '@/dojos/service': MockDojosService,
      '@/users/service': MockUsersService,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('methods', () => {
    describe('loadCurrentUser', () => {
      it('should load the current user', async () => {
        // ARRANGE
        const mockUser = {
          id: 'foo',
        };
        MockUsersService.getCurrentUser.returns(Promise.resolve({ body: { user: mockUser } }));
        const vm = vueUnitHelper(TicketListWithMocks);

        // ACT
        await vm.loadCurrentUser();

        // ASSERT
        expect(vm.currentUser).to.deep.equal(mockUser);
      });
    });
    describe('loadEvents', () => {
      it('should load the user\'s events', async () => {
        // ARRANGE
        const mockEventDataResponse = {
          results: [{
            id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
            name: 'My First Amazing Event',
            dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
            startTime: '2017-06-06T16:30:00.000Z',
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
            startTime: '2017-05-06T16:30:00.000Z',
            dates: [
              {
                startTime: '2017-06-06T16:30:00.000Z',
                endTime: '2017-06-06T18:00:00.000Z',
              },
            ],
          }],
        };
        const expected = [{
          id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
          name: 'My First Amazing Event',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          startTime: '2017-06-06T16:30:00.000Z',
          dates: [
            {
              startTime: '2017-06-06T16:30:00.000Z',
              endTime: '2017-06-06T18:00:00.000Z',
            },
          ],
        }, {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
          name: 'My Second Amazing Event',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          startTime: '2017-05-06T16:30:00.000Z',
          dates: [
            {
              startTime: '2017-06-06T16:30:00.000Z',
              endTime: '2017-06-06T18:00:00.000Z',
            },
          ],
        }, {
          id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
          name: 'My First Amazing Event',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          startTime: '2017-06-06T16:30:00.000Z',
          dates: [
            {
              startTime: '2017-06-06T16:30:00.000Z',
              endTime: '2017-06-06T18:00:00.000Z',
            },
          ],
        }, {
          id: '34174952-8ca4-4189-b8cb-d383e3fde992',
          name: 'My Second Amazing Event',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          startTime: '2017-05-06T16:30:00.000Z',
          dates: [
            {
              startTime: '2017-06-06T16:30:00.000Z',
              endTime: '2017-06-06T18:00:00.000Z',
            },
          ],
        }];
        MockEventsService.v3.get.returns(Promise.resolve({ body: mockEventDataResponse }));
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };
        vm.usersDojos = [{ dojoId: 'dojo1' }, { dojoId: 'dojo2' }];

        // ACT
        await vm.loadEvents();

        // ASSERT
        expect(MockEventsService.v3.get).to.have.been.calledTwice;
        expect(MockEventsUtil.orderByStartTime).to.have.been.calledThrice;
        expect(vm.events).to.deep.equal(expected);
      });
    });
    describe('loadUserDojos', () => {
      it('should load the user\'s dojos relationship', async () => {
        // ARRANGE
        const mockUserDojoData = [{ id: 'foobar', dojoId: 'bar', userId: 'foo' }];
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: mockUserDojoData }));
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };

        // ACT
        await vm.loadUserDojos();

        // ASSERT
        expect(vm.usersDojos).to.deep.equal(mockUserDojoData);
      });
    });
    describe('loadUsersChildren', () => {
      it('should load the user\'s children', async () => {
        // ARRANGE
        const mockProfileChildrenData = [{ userId: '1', user: { id: '1' } }, { userId: '2', user: { id: '2' } }];
        MockUsersService.getChildren.returns(Promise.resolve({ body: mockProfileChildrenData }));
        const vm = vueUnitHelper(TicketListWithMocks);
        vm.currentUser = {
          id: 'foo',
        };
        const mockUserChildrenTransformed = { foo: { id: 'foo' }, 1: { id: '1' }, 2: { id: '2' } };

        // ACT
        await vm.loadUsersChildren();

        // ASSERT
        expect(vm.users).to.deep.equal(mockUserChildrenTransformed);
      });
    });
  });
});
