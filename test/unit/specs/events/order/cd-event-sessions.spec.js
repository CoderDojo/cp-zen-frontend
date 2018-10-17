import vueUnitHelper from 'vue-unit-helper';
import SessionList from '!!vue-loader?inject!@/events/order/cd-event-sessions';

describe('Event sessions component', () => {
  let sandbox;
  let mockService;
  let MockUserService;
  let MockDojoService;
  let MockUserUtils;
  let OrderStore;
  let ChildTicket;
  let uuidMock;
  let SessionListWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockService = {
      v3: {
        createOrder: sandbox.stub(),
        getOrder: sandbox.stub(),
      },
    };
    MockUserService = {
      getCurrentUser: sandbox.stub(),
      userProfileData: sandbox.stub(),
      updateUserProfileData: sandbox.stub(),
    };
    MockDojoService = {
      joinDojo: sandbox.stub(),
    };
    ChildTicket = {
      createChild: sandbox.stub(),
    };
    MockUserUtils = {
      isYouthOverThirteen: sandbox.stub(),
    };
    OrderStore = {
      getters: {},
      state: {},
      commit: sandbox.stub(),
    };
    uuidMock = sandbox.stub();
    SessionListWithMocks = SessionList({
      'uuid/v4': uuidMock,
      '../service': mockService,
      '@/users/service': MockUserService,
      '@/dojos/service': MockDojoService,
      '@/users/util': MockUserUtils,
      '@/events/order/order-store': OrderStore,
      './cd-event-add-child-ticket': ChildTicket,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('computed.showPhone', () => {
      it('should return false if the user has a phone in their profile', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { phone: '353123456789' };
        vm.isO13 = false;
        // ACT

        // ASSERT
        expect(vm.showPhone).to.equal(false);
      });
      it('should return true if the user does not have a phone in their profile', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { phone: '' };
        vm.isO13 = false;
        // ACT

        // ASSERT
        expect(vm.showPhone).to.equal(true);
      });
      it('should return false if the user isO13', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { phone: '' };
        vm.isO13 = true;
        // ACT

        // ASSERT
        expect(vm.showPhone).to.equal(false);
      });
    });

    describe('computed.isO13', () => {
      it('should return true if the user is o13', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { dob: (new Date()).setYear((new Date()).getFullYear() - 14) };
        MockUserUtils.isYouthOverThirteen.returns(true);
        expect(vm.isO13).to.equal(true);
        expect(MockUserUtils.isYouthOverThirteen).to.have.been.calledOnce;
        expect(MockUserUtils.isYouthOverThirteen).to.have.been.calledWith(vm.profile.dob);
      });
      it('should return false if the user is an adult', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile.dob = (new Date()).setYear((new Date()).getFullYear() - 20);
        MockUserUtils.isYouthOverThirteen.returns(false);
        expect(vm.isO13).to.equal(false);
        expect(MockUserUtils.isYouthOverThirteen).to.have.been.calledOnce;
        expect(MockUserUtils.isYouthOverThirteen).to.have.been.calledWith(vm.profile.dob);
      });
    });

    describe('computed.isDisplayable', () => {
      it('should return true if the user is Single', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isSingle = true;

        // ASSERT
        expect(vm.isDisplayable).to.be.true;
      });
      it('should return true if the user is Mentoring', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isMentoring = true;

        // ASSERT
        expect(vm.isDisplayable).to.be.true;
      });
      it('should return true if the user has children', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.hasChildren = true;

        // ASSERT
        expect(vm.isDisplayable).to.be.true;
      });
    });

    describe('computed.totalBooked', () => {
      it('should return the length of the children array', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.applications = [1, 2];

        // ASSERT
        expect(vm.totalBooked).to.equal(2);
      });
    });

    describe('computed.hasChildren', () => {
      it('should return true when the user has children tickets created', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{}];

        // ASSERT
        expect(vm.hasChildren).to.be.true;
      });
      it('should return true when the user has profile children', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = {
          children: [{}],
        };
        // ASSERT
        expect(vm.hasChildren).to.be.true;
      });
    });

    describe('computed.isMentoring', () => {
      it('should return true when the user has a dojoRole of champion', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.dojoRole = { userTypes: ['champion'] };

        // ASSERT
        expect(vm.isMentoring).to.be.true;
      });
      it('should return true when the user has a dojoRole of mentor', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.dojoRole = { userTypes: ['mentor'] };

        // ASSERT
        expect(vm.isMentoring).to.be.true;
      });
    });

    describe('computed.applications', () => {
      it('should return the value of the store without adult ticket', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }, { value: { name: 'Jane Doe' }, id: '2' }];

        OrderStore.getters.applications = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
        // ASSERT
        expect(vm.applications).to.deep.equal(OrderStore.getters.applications);
      });
      it('should add the parentTicket if defined', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        OrderStore.getters.applications = [{ id: '1', name: 'John Doe' }];
        vm.parentTicket = { name: 'parent1', id: '2' };

        // ASSERT
        expect(vm.applications).to.deep.equal([{
          name: 'John Doe',
          id: '1',
        }, {
          name: 'parent1',
          id: '2',
        }]);
      });
    });

    describe('computed.isSingle', () => {
      it('should return true if the user is o13 without children', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = true;
        vm.hasChildren = false;
        expect(vm.isSingle).to.be.true;
      });
      it('should return false if the user has children', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = false;
        vm.isMentoring = true;
        vm.hasChildren = true;
        expect(vm.isSingle).to.be.false;
      });
      it('should return true if the user is mentoring without children', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = false;
        vm.isMentoring = true;
        vm.hasChildren = false;
        expect(vm.isSingle).to.be.true;
      });
    });
    describe('computed.users', () => {
      it('should return a list containing the current user if isSingle', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { id: '1' };
        vm.isSingle = true;
        expect(vm.users).to.deep.equal([vm.profile]);
      });
      it('should return a empty list if the current user is not isSingle', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { id: '1' };
        vm.isSingle = false;
        expect(vm.users).to.deep.equal([]);
      });
      it('should return the existing children if not mentoring nor single ', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isSingle = false;
        vm.isMentoring = false;
        vm.existingChildren = [{ banana: true }];
        expect(vm.users).to.deep.equal([{ banana: true }]);
      });
      it('should return the existing children and the user profile if Mentoring', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = { id: '1' };
        vm.isSingle = false;
        vm.isMentoring = true;
        vm.existingChildren = [{ banana: true }];
        expect(vm.users).to.deep.equal([{ id: '1' }, { banana: true }]);
      });
    });
    describe('dojoRole', () => {
      it('should return the roles for the current dojo', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.event = { dojoId: '1' };
        vm.userDojos = [{ dojoId: '1', userTypes: ['mentor'] }, { dojoId: '2', userTypes: ['ninja'] }];
        expect(vm.dojoRole).to.deep.equal({ dojoId: '1', userTypes: ['mentor'] });
      });
    });
  });
  describe('methods', () => {
    describe('methods.addChildComponent()', () => {
      it('should add a new child component if all child components are valid', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }];
        uuidMock.returns('2');

        // ACT
        await vm.addChildComponent();

        // ASSERT
        expect(vm.children).to.deep.equal([{ value: { name: 'John Doe' }, id: '1' }, { value: {}, id: '2' }]);
      });

      it('should add a new child component if there are no child components', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [];
        uuidMock.returns('1');

        // ACT
        await vm.addChildComponent();

        // ASSERT
        expect(vm.children).to.deep.equal([{ value: {}, id: '1' }]);
      });
    });

    describe('methods.deleteChildComponent()', () => {
      it('should delete child component at the index provided', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }, { value: { name: 'Jane Doe' }, id: '2' }];

        // ACT
        vm.deleteChildComponent(0);

        // ASSERT
        expect(vm.children).to.deep.equal([{ value: { name: 'Jane Doe' }, id: '2' }]);
        expect(OrderStore.commit).to.have.been.calledWith('removeApplications', '1');
      });
    });

    describe('methods.initStore()', () => {
      it('should get the existing order and set existingApplications', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.v3.getOrder.resolves({
          body: {
            results: [{
              applications: [{
                dateOfBirth: '1969-11-26T00:00:00.000Z',
                eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
                ticketName: 'Mentor',
                ticketType: 'mentor',
                sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
                dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
                ticketId: '018a57a1-0696-44ad-81b8-0d7b8480e422',
                userId: 'mentor1',
              }],
              id: '087b9c30-6e39-11e8-85be-bd6e50591bce',
            }] },
        });
        vm.user = {
          id: 'user1',
        };
        vm.eventId = 'event1';

        // ACT
        await vm.initStore();

        // ASSERT
        expect(mockService.v3.getOrder).to.have.been.calledOnce;
        expect(mockService.v3.getOrder).to.have.been.calledWith('user1', { params: { 'query[eventId]': 'event1' } });
        expect(vm.existingApplications).to.deep.equal({ mentor1: [{
          dateOfBirth: '1969-11-26T00:00:00.000Z',
          eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
          ticketName: 'Mentor',
          ticketType: 'mentor',
          sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          ticketId: '018a57a1-0696-44ad-81b8-0d7b8480e422',
          userId: 'mentor1',
        }] });
      });
      it('should get the existing order and set existingApplications while excluding parent ticket', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.v3.getOrder.resolves({
          body: {
            results: [{
              applications: [{
                dateOfBirth: '1969-11-26T00:00:00.000Z',
                eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
                ticketName: 'kid',
                ticketType: 'ninja',
                sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
                dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
                ticketId: '018a57a1-0696-44ad-81b8-0d7b8480e422',
                userId: 'kido1',
              }, {
                dateOfBirth: '1969-11-26T00:00:00.000Z',
                eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
                ticketName: 'parent',
                ticketType: 'parent-guardian',
                sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
                dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
                ticketId: '018a57a1-0696-44ad-81b8-0d7b8480e422',
                userId: 'parent1',
              }],
              id: '087b9c30-6e39-11e8-85be-bd6e50591bce',
            }] },
        });
        vm.user = {
          id: 'user1',
        };
        vm.eventId = 'event1';

        // ACT
        await vm.initStore();

        // ASSERT
        expect(mockService.v3.getOrder).to.have.been.calledOnce;
        expect(mockService.v3.getOrder).to.have.been.calledWith('user1', { params: { 'query[eventId]': 'event1' } });
        expect(vm.existingApplications).to.deep.equal({ kido1: [{
          dateOfBirth: '1969-11-26T00:00:00.000Z',
          eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
          ticketName: 'kid',
          ticketType: 'ninja',
          sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          ticketId: '018a57a1-0696-44ad-81b8-0d7b8480e422',
          userId: 'kido1',
        }] });
      });
      it('should set existingApplications to an empty object if there are no results', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.v3.getOrder.resolves({
          body: {
            results: [],
          },
        });
        vm.user = {
          id: 'user1',
        };
        vm.eventId = 'event1';

        // ACT
        await vm.initStore();

        // ASSERT
        expect(mockService.v3.getOrder).to.have.been.calledOnce;
        expect(mockService.v3.getOrder).to.have.been.calledWith('user1', { params: { 'query[eventId]': 'event1' } });
        expect(vm.existingApplications).to.deep.equal({});
      });
    });

    describe('methods.addPhoneNumber()', () => {
      it('should add users phone number to their profile', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.validPhone = true;
        vm.profile = { id: 'user1' };
        MockUserService.userProfileData.withArgs(vm.user.id)
        .returns(Promise.resolve({ id: 'user1', phone: '' }));
        vm.phone = '+353123456789';

        // ACT
        await vm.addPhoneNumber();

        // ASSERT
        expect(MockUserService.updateUserProfileData).to.have.been.calledWith({ id: 'user1', phone: '+353123456789' });
      });
    });

    describe.only('methods.addNewChildren()', () => {
      it('should call the create child funtion for each child component', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        const order = [];
        vm.$refs = {
          allChildComponents: [
            {
              createChild: () => new Promise((resolve) => {
                setTimeout(() => {
                  order.push(1);
                  resolve();
                }, 500);
              }),
            },
            {
              createChild: () => new Promise((resolve) => {
                setTimeout(() => {
                  order.push(2);
                  resolve();
                }, 100);
              }),
            },
            {
              createChild: () => new Promise((resolve) => {
                setTimeout(() => {
                  order.push(3);
                  resolve();
                }, 200);
              }),
            },
          ],
        };

        // ACT
        await vm.addNewChildren();

        // ASSERT
        expect(order).to.deep.equal([1, 2, 3]);
      });
    });

    describe('methods.bookTickets()', () => {
      it('should send applications to be booked with createOrder without extra ticket (isSingle = true)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.v3.createOrder.resolves(true);
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
        vm.eventId = 'event1';
        vm.totalBooked = 1;
        vm.isSingle = true;
        vm.applications = [{
          eventId: 'eventId',
          name: 'Jane Doe',
          sessionId: 'sessionId1',
        }, {
          eventId: 'eventId',
          name: 'John Doe',
          sessionId: 'sessionId2',
        }];
        // ACT
        const result = await vm.bookTickets();

        // ASSERT
        expect(result).to.equal(true);
        expect(mockService.v3.createOrder).to.have.been.calledOnce;
        expect(mockService.v3.createOrder).to.have.been.calledWith(vm.eventId, vm.applications);
        expect(vm.$ga.event).to.have.been.calledOnce;
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets', 1);
      });
      it('should send applications to be booked with createOrder with extra ticket (isSingle = false)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.v3.createOrder.resolves(true);
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
        vm.totalBooked = 1;
        vm.isSingle = false;
        vm.isO13 = false;
        vm.hasChildren = true;
        vm.createParentTicket = sandbox.stub();
        vm.applications = [{
          eventId: 'eventId',
          name: 'Jane Doe',
          sessionId: 'sessionId1',
        }, {
          eventId: 'eventId',
          name: 'John Doe',
          sessionId: 'sessionId2',
        }];
        // ACT
        const result = await vm.bookTickets();

        // ASSERT
        expect(result).to.equal(true);
        expect(mockService.v3.createOrder).to.have.been.calledOnce;
        expect(mockService.v3.createOrder).to.have.been.calledWith(vm.eventId, vm.applications);
        expect(vm.$ga.event).to.have.been.calledOnce;
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets', 1);
        expect(vm.createParentTicket).to.have.been.calledOnce;
      });
    });
    describe('methods.joinDojo()', () => {
      beforeEach(() => sandbox.restore());
      it('should call joinDojo with the right userType (parent)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = {
          userId: 'user1',
        };
        vm.event = {
          dojoId: 'dojo1',
        };
        vm.isO13 = false;
        vm.joinDojo();
        expect(MockDojoService.joinDojo).to.have.been.calledOnce;
        expect(MockDojoService.joinDojo).to.have.been.calledWith('user1', 'dojo1', ['parent-guardian']);
        expect(OrderStore.commit).to.have.been.calledWith('setIsNewDojoMember', true);
      });
      it('should call joinDojo with the right userType (attendee-o13)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = {
          userId: 'user1',
        };
        vm.event = {
          dojoId: 'dojo1',
        };
        vm.isO13 = true;
        vm.joinDojo();
        expect(MockDojoService.joinDojo).to.have.been.calledOnce;
        expect(MockDojoService.joinDojo).to.have.been.calledWith('user1', 'dojo1', ['attendee-o13']);
        expect(OrderStore.commit).to.have.been.calledWith('setIsNewDojoMember', true);
      });
    });

    describe('methods.setupPrerequisites()', () => {
      beforeEach(() => sandbox.restore());
      it('should call addPhoneNumber and addNewChildren if showPhone is true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.showPhone = true;
        vm.dojoRole = {};
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        sandbox.stub(vm, 'joinDojo');
        // ACT
        await vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.have.been.calledOnce;
        expect(vm.addNewChildren).to.have.been.calledOnce;
        expect(vm.joinDojo).to.not.have.been.called;
      });
      it('should call only addNewChildren if showPhone is false and dojoRole is defined', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        sandbox.stub(vm, 'joinDojo');
        vm.profile = { phone: '01' };
        vm.isO13 = false;
        vm.dojoRole = {};
        // ACT
        await vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.not.have.been.called;
        expect(vm.addNewChildren).to.have.been.calledOnce;
        expect(vm.joinDojo).to.not.have.been.called;
      });
      it('should call joinDojo if dojoRole is falsy', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        sandbox.stub(vm, 'joinDojo');
        vm.profile = { phone: '01' };
        vm.isO13 = false;
        vm.dojoRole = undefined;
        // ACT
        await vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.not.have.been.called;
        expect(vm.addNewChildren).to.have.been.calledOnce;
        expect(vm.joinDojo).to.have.been.calledOnce;
      });
    });

    describe('methods.submitBooking()', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(SessionListWithMocks);
        vm.errors = {
          clear: sandbox.stub(),
          add: sandbox.stub(),
        };
        vm.$router = {
          push: sandbox.spy(),
        };
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
      });

      it('should call bookTickets and router push when setupSucceeded is true ', async () => {
        // ARRANGE
        vm.$validator = {
          validateAll: () => true,
        };
        sandbox.stub(vm, 'setupPrerequisites').resolves(true);
        sandbox.stub(vm, 'bookTickets');

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.setupPrerequisites).to.have.been.calledOnce;
        expect(vm.bookTickets).to.have.been.calledOnce;
        expect(vm.$router.push).to.be.calledWith({ name: 'EventBookingConfirmation', params: { eventId: vm.eventId } });
      });

      it('should do nothing when setupSucceeded is false', async () => {
        // ARRANGE
        vm.$validator = {
          validateAll: () => true,
        };
        sandbox.stub(vm, 'setupPrerequisites').resolves(false);
        sandbox.stub(vm, 'bookTickets');

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.setupPrerequisites).to.have.been.calledOnce;
        expect(vm.bookTickets).to.not.have.been.calledOnce;
        expect(vm.$router.push).to.not.have.been.called;
      });
    });
    describe('methods.createParentTicket', () => {
      it('should create a parent ticket from the selected tickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.profile = {
          name: 'Jane Doe',
          dob: '1975-05-08',
          userId: 'user1',
        };
        vm.applications = [{ sessionId: 'session2' }];
        const mockTickets = (index, sessionId) => ([{ id: `ticket${index}1`, name: `ticket${index}1`, type: 'ninja', sessionId },
          { id: `ticket${index}2`, name: `ticket${index}2`, type: 'parent-guardian', sessionId }]);
        vm.event = {
          id: 'event1',
          dojoId: 'dojo1',
          sessions: [
            { id: 'session1', tickets: mockTickets(1, 'session1') },
            { id: 'session2', tickets: mockTickets(2, 'session2') },
          ],
        };

        // ACT
        vm.createParentTicket();

        // ASSERT
        expect(vm.parentTicket).to.deep.equal({
          name: 'Jane Doe',
          dateOfBirth: '1975-05-08',
          eventId: 'event1',
          ticketName: 'ticket22',
          ticketType: 'parent-guardian',
          sessionId: 'session2',
          dojoId: 'dojo1',
          ticketId: 'ticket22',
          userId: 'user1',
        });
      });
      it('should not create a ticket if there is no match', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.applications = [{ sessionId: 'session2' }];
        const mockTickets = (index, sessionId) => ([{ id: `ticket${index}1`, name: `ticket${index}1`, type: 'ninja', sessionId },
          { id: `ticket${index}2`, name: `ticket${index}2`, type: 'parent-guardian', sessionId }]);
        vm.event = {
          sessions: [
            { id: 'session1', tickets: mockTickets(1, 'session1') },
            { id: 'session2', tickets: [{ id: 'ticket21', name: 'ticket21', type: 'ninja', sessionId: 'session2' }] },
          ],
        };

        // ACT
        vm.createParentTicket();

        // ASSERT
        expect(vm.parentTicket).to.equal(null);
      });
    });
  });

  it('should load the current user', async () => {
    // ARRANGE
    const vm = vueUnitHelper(SessionListWithMocks);
    MockUserService.getCurrentUser.returns({ body: { user: { name: 'parent1' } } });

    // ACT
    await vm.loadCurrentUser();

    // ASSERT
    expect(vm.user).to.deep.equal({ name: 'parent1' });
  });

  describe('created', () => {
    it('should add a default child if the user is having no child and is not single', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.initStore = sinon.stub().resolves();
      vm.profile.children = [];
      vm.isSingle = false;
      vm.children = [];

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(1);
      expect(OrderStore.commit).to.have.been.calledOnce;
      expect(OrderStore.commit).to.have.been.calledWith('resetApplications');
    });
    it('should not add a default child if the user has children', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.initStore = sinon.stub().resolves();
      vm.profile.children = [{ id: '1' }];
      vm.isSingle = false;

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(0);
      expect(OrderStore.commit).to.have.been.calledOnce;
      expect(OrderStore.commit).to.have.been.calledWith('resetApplications');
    });
    it('should not add a default child if the user is single', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.initStore = sinon.stub().resolves();
      vm.profile.children = [];
      vm.isSingle = true;

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(0);
      expect(OrderStore.commit).to.have.been.calledOnce;
      expect(OrderStore.commit).to.have.been.calledWith('resetApplications');
    });
  });
});
