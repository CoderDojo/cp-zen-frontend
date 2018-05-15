import vueUnitHelper from 'vue-unit-helper';
import SessionList from '!!vue-loader?inject!@/events/cd-event-sessions';

describe('Event sessions component', () => {
  let sandbox;
  let mockService;
  let MockStoreService;
  let MockUserService;
  let MockUserUtils;
  let ChildTicket;
  let uuidMock;
  let SessionListWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockService = {
      loadSessions: sandbox.stub(),
      manageTickets: sandbox.stub(),
    };
    MockStoreService = {
      load: sandbox.stub(),
      save: sandbox.stub(),
    };
    MockUserService = {
      getCurrentUser: sandbox.stub(),
      userProfileData: sandbox.stub(),
      updateUserProfileData: sandbox.stub(),
    };
    ChildTicket = {
      createChild: sandbox.stub(),
    };
    MockUserUtils = {
      isYouthOverThirteen: sandbox.stub(),
    };
    uuidMock = sandbox.stub();
    SessionListWithMocks = SessionList({
      'uuid/v4': uuidMock,
      './service': mockService,
      '@/store/store-service': MockStoreService,
      '@/users/service': MockUserService,
      '@/users/util': MockUserUtils,
      './cd-event-add-child-ticket': ChildTicket,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe.skip('computed.showPhone', () => {
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

    describe('computed.totalBooked', () => {
      it('should return the length of the children array', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.applications = [1, 2];

        // ASSERT
        expect(vm.totalBooked).to.equal(2);
      });
    });

    describe('computed.applications', () => {
      it('should return the value of each object in the children array', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }, { value: { name: 'Jane Doe' }, id: '2' }];

        // ASSERT
        expect(vm.applications).to.deep.equal([
          {
            name: 'John Doe',
          },
          {
            name: 'Jane Doe',
          }]);
      });
      it('should return the existing users tickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.usersTickets = [{ name: 'John Doe', id: '1' }];

        // ASSERT
        expect(vm.applications).to.deep.equal([{
          name: 'John Doe',
          id: '1',
        }]);
      });
      it('should add the parentTicket if defined', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.usersTickets = [{ name: 'John Doe', id: '1' }];
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
      it('should return true if the user is o13', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = true;
        expect(vm.isSingle).to.be.true;
      });
      it('should return false if the user is not an adult with children', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = false;
        vm.dojoRole = undefined;
        expect(vm.isSingle).to.be.false;
      });
      it('should return true if the user is an adult mentor', () => {
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.isO13 = false;
        vm.dojoRole = { userTypes: ['mentor'] };
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

    describe('methods.addNewChildren()', () => {
      it('should call the create child funtion for each child component', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.$refs = {
          allChildComponents: [
            {
              createChild: ChildTicket.createChild,
            },
            {
              createChild: ChildTicket.createChild,
            },
          ],
        };

        // ACT
        await vm.addNewChildren();

        // ASSERT
        expect(ChildTicket.createChild).to.have.been.calledTwice;
      });
    });

    describe('methods.bookTickets()', () => {
      it('should send applications to be booked with manageTickets without extra ticket (isSingle = true)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.manageTickets.resolves(true);
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
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
        await vm.bookTickets();

        // ASSERT
        expect(mockService.manageTickets).to.have.been.calledOnce;
        expect(mockService.manageTickets).to.have.been.calledWith(vm.applications);
        expect(vm.$ga.event).to.have.been.calledOnce;
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets', 1);
      });
      it('should send applications to be booked with manageTickets with extra ticket (isSingle = false)', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        mockService.manageTickets.resolves(true);
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
        vm.totalBooked = 1;
        vm.isSingle = false;
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
        await vm.bookTickets();

        // ASSERT
        expect(mockService.manageTickets).to.have.been.calledOnce;
        expect(mockService.manageTickets).to.have.been.calledWith(vm.applications);
        expect(vm.$ga.event).to.have.been.calledOnce;
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets', 1);
        expect(vm.createParentTicket).to.have.been.calledOnce;
      });
    });

    describe('methods.setupPrerequisites()', () => {
      beforeEach(() => sandbox.restore());
      it('should call addPhoneNumber and addNewChildren if showPhone is true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.showPhone = true;
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        // ACT
        await vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.have.been.calledOnce;
        expect(vm.addNewChildren).to.have.been.calledOnce;
      });
      it('PhoneNumberhould call only addNewChildren if showPhone is false', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        vm.profile = { phone: '01' };
        vm.isO13 = false;
        // ACT
        await vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.not.have.been.called;
        expect(vm.addNewChildren).to.have.been.calledOnce;
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
        vm.status = 'approved';
        vm.profile = {
          name: 'Jane Doe',
          dob: '1975-05-08',
          userId: 'user1',
        };
        vm.event = { id: 'event1', dojoId: 'dojo1' };
        vm.applications = [{ sessionId: 'session2' }];
        const mockTickets = (index, sessionId) => ([{ id: `ticket${index}1`, name: `ticket${index}1`, type: 'ninja', sessionId },
          { id: `ticket${index}2`, name: `ticket${index}2`, type: 'parent-guardian', sessionId }]);
        vm.sessions = [{ id: 'session1', tickets: mockTickets(1, 'session1') }, { id: 'session2', tickets: mockTickets(2, 'session2') }];

        // ACT
        vm.createParentTicket();

        // ASSERT
        expect(vm.parentTicket).to.deep.equal({
          name: 'Jane Doe',
          dateOfBirth: '1975-05-08',
          eventId: 'event1',
          status: 'approved',
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
        vm.sessions = [{ id: 'session1', tickets: mockTickets(1, 'session1') }, { id: 'session2', tickets: [{ id: 'ticket21', name: 'ticket21', type: 'ninja', sessionId: 'session2' }] }];

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

  it('should load the selected event', (done) => {
    // ARRANGE
    const vm = vueUnitHelper(SessionListWithMocks);
    vm.eventId = '123';
    const event = { name: 'Foo event' };
    MockStoreService.load.withArgs('selected-event')
      .returns(event);

    // ACT
    vm.loadEvent();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.event).to.deep.equal(event);
      expect(MockStoreService.load).to.be.calledOnce;
      expect(MockStoreService.save).to.be.calledOnce;
      expect(MockStoreService.save).to.be.calledWith(`booking-${vm.eventId}-sessions`, {});
      done();
    });
  });

  it('should show the list of event sessions', (done) => {
    // ARRANGE
    const mockSessionDataResponse = [
      {
        name: 'Scratch',
        description: 'Beginners welcomes',
      },
      {
        name: 'Arduino',
        description: 'Intermediate',
      },
    ];

    const vm = vueUnitHelper(SessionListWithMocks);
    vm.eventId = '123';
    vm.event = {
      name: 'Scratch',
    };
    mockService.loadSessions.withArgs(vm.eventId)
      .returns(Promise.resolve({ body: mockSessionDataResponse }));

    // ACT
    vm.loadSessions();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.sessions).to.deep.equal(mockSessionDataResponse);
      expect(MockStoreService.save).to.have.been.calledWith('selected-event', {
        name: 'Scratch',
        sessions: mockSessionDataResponse,
      });
      done();
    });
  });

  describe('created', () => {
    it('should add a default child if the user is having no child and is not single', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadSessions = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.profile.children = [];
      vm.isSingle = false;
      vm.children = [];

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(1);
    });
    it('should not add a default child if the user has children', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadSessions = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.profile.children = [{ id: '1' }];
      vm.isSingle = false;

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(0);
    });
    it('should not add a default child if the user is single', async () => {
      const vm = vueUnitHelper(SessionListWithMocks);
      vm.loadEvent = sinon.stub().resolves();
      vm.setEvent = sinon.stub().resolves();
      vm.loadSessions = sinon.stub().resolves();
      vm.loadCurrentUser = sinon.stub().resolves();
      vm.loadProfile = sinon.stub().resolves();
      vm.loadChildren = sinon.stub().resolves();
      vm.loadDojoRelationship = sinon.stub().resolves();
      vm.profile.children = [];
      vm.isSingle = true;

      await vm.$lifecycleMethods.created();
      expect(vm.children.length).to.equal(0);
    });
  });
});
