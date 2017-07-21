import vueUnitHelper from 'vue-unit-helper';
import eventList from '!!vue-loader?inject!@/events/cd-event-list';

describe('Event list component', () => {
  let sandbox;
  let EventListWithMocks;
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
    };
    EventListWithMocks = eventList({
      '@/users/service': MockUsersService,
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

  describe('getSessionListForEvent()', () => {
    it('should return a list of session names for given event', () => {
      const vm = vueUnitHelper(eventList());
      const eventMock = {
        sessions: [
          { name: 'Scratch' },
          { name: 'Arduino' },
          { name: 'HTML' },
        ],
      };

      expect(vm.getSessionListForEvent(eventMock)).to.equal('Scratch, Arduino, HTML');
    });
  });

  describe('isEventFull()', () => {
    it('should return true for an event which is full and false for one which is not full', () => {
      const vm = vueUnitHelper(eventList());
      vm.events = [
        {
          id: 1,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 3,
                },
                {
                  quantity: 4,
                  approvedApplications: 4,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 2,
                },
                {
                  quantity: 5,
                  approvedApplications: 5,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 2,
                },
                {
                  quantity: 4,
                  approvedApplications: 3,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 1,
                },
                {
                  quantity: 5,
                  approvedApplications: 4,
                },
              ],
            },
          ],
        },
      ];

      expect(vm.isEventFull(vm.events[0])).to.equal(true);
      expect(vm.isEventFull(vm.events[1])).to.equal(false);
    });
  });

  describe('computed.canBook', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(eventList());
    });

    it('should be false if this.currentUser is falsey and dojo is private', () => {
      // ARRANGE
      vm.currentUser = null;
      vm.dojo = {
        private: 1,
      };

      // ASSERT
      expect(vm.canBook).to.equal(false);
    });

    it('should be true if this.currentUser is truthy and they are a member of the dojo, but dojo is private', () => {
      // ARRANGE
      vm.currentUser = {
        id: 'foo',
      };
      vm.isMember = true;
      vm.dojo = {
        private: 1,
      };

      // ASSERT
      expect(vm.canBook).to.equal(true);
    });

    it('should be true if this.currentUser is falsey and dojo is public', () => {
      // ARRANGE
      vm.currentUser = null;
      vm.dojo = {
        private: 0,
      };

      // ASSERT
      expect(vm.canBook).to.equal(true);
    });

    it('should be true if this.currentUser is truthy and dojo is public', () => {
      // ARRANGE
      vm.currentUser = {
        id: 'foo',
      };
      vm.dojo = {
        private: 0,
      };

      // ASSERT
      expect(vm.canBook).to.equal(true);
    });

    it('should be false if this.currentUser is true and they are not a member of the dojo, but the dojo is private', () => {
      // ARRANGE
      vm.currentUser = {
        id: 'foo',
      };
      vm.isMember = false;
      vm.dojo = {
        private: 1,
      };

      // ASSERT
      expect(vm.canBook).to.equal(false);
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
  });

  describe('watch', () => {
    describe('currentUser', () => {
      it('should set isMember to true if the new currentUser is a member of the dojo', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(EventListWithMocks);
        vm.dojo = {
          id: 'dojo',
        };
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: ['foo'] }));

        // ACT
        vm.$watchers.currentUser('foo');

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersDojos).to.deep.equal(['foo']);
          expect(vm.isMember).to.equal(true);
          done();
        });
      });
      it('should set isMember to false if the new currentUser is not a member of the dojo', (done) => {
        // ARRANGE
        const vm = vueUnitHelper(EventListWithMocks);
        vm.dojo = {
          id: 'dojo',
        };
        MockDojosService.getUsersDojos.returns(Promise.resolve({ body: [] }));

        // ACT
        vm.$watchers.currentUser('bar');

        // ASSERT
        requestAnimationFrame(() => {
          expect(vm.usersDojos).to.deep.equal([]);
          expect(vm.isMember).to.equal(false);
          done();
        });
      });
    });
  });
});
