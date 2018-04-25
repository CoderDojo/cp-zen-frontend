import vueUnitHelper from 'vue-unit-helper';
import SessionList from '!!vue-loader?inject!@/events/cd-event-sessions';

describe('Event sessions component', () => {
  const sandbox = sinon.sandbox.create();
  const mockService = {
    loadSessions: sandbox.stub(),
    manageTickets: sandbox.stub(),
  };
  const MockStoreService = {
    load: sandbox.stub(),
    save: sandbox.stub(),
  };
  const MockUserService = {
    getCurrentUser: sandbox.stub(),
    userProfileData: sandbox.stub(),
    updateUserProfileData: sandbox.stub(),
  };
  const ChildTicket = {
    createChild: sandbox.stub(),
  };
  const uuidMock = sandbox.stub();
  const SessionListWithMocks = SessionList({
    'uuid/v4': uuidMock,
    './service': mockService,
    '@/store/store-service': MockStoreService,
    '@/users/service': MockUserService,
    './cd-event-add-child-ticket': ChildTicket,
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('computed.showPhone', () => {
      it('should return false if the user has a phone in their profile', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.user = { phone: '353123456789' };
        // ACT

        // ASSERT
        expect(vm.showPhone).to.equal(false);
      });
      it('should return true if the user does not have a phone in their profile', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.user = { phone: '' };
        // ACT

        // ASSERT
        expect(vm.showPhone).to.equal(true);
      });
    });

    describe('computed.totalBooked', () => {
      it('should return the length of the children array', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }, { value: { name: 'Jane Doe' }, id: '2' }];
        // ACT

        // ASSERT
        expect(vm.totalBooked).to.equal(2);
      });
    });

    describe('computed.applications', () => {
      it('should return the value of each object in the children array', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }, { value: { name: 'Jane Doe' }, id: '2' }];
        // ACT

        // ASSERT
        expect(vm.applications).to.deep.equal([
          {
            name: 'John Doe',
          },
          {
            name: 'Jane Doe',
          }]);
      });
    });

    describe('computed.bookingType', () => {
      it('should return a bookingType of Request if the event ticketApproval is set to true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.event = { ticketApproval: true };

        // ACT

        // ASSERT
        expect(vm.bookingType).to.equal('Request');
      });

      it('should return a bookingType of Confirm if the event ticketApproval is set to false', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.event = { ticketApproval: false };

        // ACT

        // ASSERT
        expect(vm.bookingType).to.equal('Confirm');
      });
    });
  });

  describe('methods', () => {
    describe('methods.validateAllChildComponents()', () => {
      it('should create an array value of true if the validation of the child component resolves to true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.$refs = {
          allChildComponents: [
            {
              $validator: {
                validateAll: () => Promise.resolve(true),
              },
            },
          ],
        };
        // ACT
        const validatedChild = await vm.validateAllChildComponents();

        // ASSERT
        expect(validatedChild).to.deep.equal([true]);
      });
      it('should create an array value of false if the validation of the child component resolves to false', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.$refs = {
          allChildComponents: [
            {
              $validator: {
                validateAll: () => Promise.resolve(false),
              },
            },
          ],
        };
        // ACT
        const validatedChild = await vm.validateAllChildComponents();

        // ASSERT
        expect(validatedChild).to.deep.equal([false]);
      });
    });

    describe('methods.checkValidatedChildComponents()', () => {
      it('should set valid to true if validatedChildComponents are all true', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.validChildren = null;
        sandbox.stub(vm, 'validateAllChildComponents').resolves([true]);

        // ACT
        await vm.checkValidatedChildComponents();

        // ASSERT
        expect(vm.validChildren).to.equal(true);
      });

      it('should set valid to false if all (or one of) validatedChildComponents are/is false', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.validChildren = null;
        sandbox.stub(vm, 'validateAllChildComponents').resolves([false]);

        // ACT
        await vm.checkValidatedChildComponents();

        // ASSERT
        expect(vm.validChildren).to.equal(false);
      });

      it('should not change the value of valid if there are no child components', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.validChildren = null;
        sandbox.stub(vm, 'validateAllChildComponents').resolves([]);

        // ACT
        await vm.checkValidatedChildComponents();

        // ASSERT
        expect(vm.validChildren).to.equal(null);
      });
    });

    describe('methods.addChildComponent()', () => {
      it('should add a new child component if all child components are valid', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: 'John Doe' }, id: '1' }];
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = true;
        });
        uuidMock.returns('2');
        vm.errors = {
          clear: sandbox.stub(),
        };

        // ACT
        await vm.addChildComponent();

        // ASSERT
        expect(vm.checkValidatedChildComponents).to.have.been.called;
        expect(vm.validChildren).to.equal(true);
        expect(vm.errors.clear).to.have.been.called;
        expect(vm.children).to.deep.equal([{ value: { name: 'John Doe' }, id: '1' }, { value: {}, id: '2' }]);
      });

      it('should add error and not a child component if child components are invalid', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [{ value: { name: '' }, id: '1' }];
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = false;
        });
        vm.errors = {
          add: sandbox.stub(),
        };

        // ACT
        await vm.addChildComponent();

        // ASSERT
        expect(vm.checkValidatedChildComponents).to.have.been.called;
        expect(vm.validChildren).to.equal(false);
        expect(vm.errors.add).to.have.been.calledWith('addChildFailed');
        expect(vm.children).to.deep.equal([{ value: { name: '' }, id: '1' }]);
      });

      it('should add a new child component if there are no child components', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.children = [];
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = true;
        });
        uuidMock.returns('1');
        vm.errors = {
          clear: sandbox.stub(),
        };

        // ACT
        await vm.addChildComponent();

        // ASSERT
        expect(vm.errors.clear).to.have.been.called;
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
        vm.validPhone = false;
        vm.user = { id: 'user1' };

        // ACT
        const result = await vm.addPhoneNumber();

        // ASSERT
        expect(result).to.equal(false);
      });
      it('should add users phone number to their profile', async () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.validPhone = true;
        vm.user = { id: 'user1' };
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
      it('should send applications to be booked with manageTickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.$ga = { event: sinon.stub() };
        vm.$route = { name: 'a' };
        vm.totalBooked = 1;
        vm.applications = [{
          event_id: 'eventId',
          name: 'Jane Doe',
          session_id: 'sessionId1',
        }, {
          event_id: 'eventId',
          name: 'John Doe',
          session_id: 'sessionId2',
        }];
        // ACT
        vm.bookTickets();

        // ASSERT
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets', vm.totalBooked);
        expect(mockService.manageTickets).to.have.been.calledWith(vm.applications);
      });
    });

    describe('methods.setupPrerequisites()', () => {
      it('should call addPhoneNumber and addNewChildren if showPhone is true', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.user = { phone: '' };
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        // ACT
        vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.have.been.called;
        expect(vm.addNewChildren).to.have.been.called;
      });
      it('should call only addNewChildren if showPhone is false', () => {
        // ARRANGE
        const vm = vueUnitHelper(SessionListWithMocks);
        vm.user = { phone: '123456789' };
        sandbox.stub(vm, 'addPhoneNumber');
        sandbox.stub(vm, 'addNewChildren');
        // ACT
        vm.setupPrerequisites();

        // ASSERT
        expect(vm.addPhoneNumber).to.not.have.been.called;
        expect(vm.addNewChildren).to.have.been.called;
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

      it('should call bookTickets and router push when showPhone, validPhone, validChildren, and setupSucceeded are true ', async () => {
        // ARRANGE
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = true;
        });
        vm.user = { phone: '' };
        vm.$validator = {
          validateAll: () => true,
        };
        sandbox.stub(vm, 'setupPrerequisites').resolves(true);
        sandbox.stub(vm, 'bookTickets');

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.errors.clear).to.have.been.called;
        expect(vm.showPhone).to.equal(true);
        expect(vm.validPhone).to.equal(true);
        expect(vm.validChildren).to.equal(true);
        expect(vm.setupPrerequisites).to.have.been.called;
        expect(vm.bookTickets).to.have.been.called;
        expect(vm.$router.push).to.be.calledWith({ name: 'EventBookingConfirmation', params: { eventId: vm.eventId } });
      });

      it('should call bookTickets and router push when validChildren and setupSucceeded are true. showPhone is false', async () => {
        // ARRANGE
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = true;
        });
        vm.user = { phone: '123456789' };
        sandbox.stub(vm, 'setupPrerequisites').resolves(true);
        sandbox.stub(vm, 'bookTickets');

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.errors.clear).to.have.been.called;
        expect(vm.showPhone).to.equal(false);
        expect(vm.validChildren).to.equal(true);
        expect(vm.setupPrerequisites).to.have.been.called;
        expect(vm.bookTickets).to.have.been.called;
        expect(vm.$router.push).to.be.calledWith({ name: 'EventBookingConfirmation', params: { eventId: vm.eventId } });
      });

      it('should add submitChildComponentsFailed error when validChildren is false. showPhone is true', async () => {
        // ARRANGE
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = false;
        });
        vm.user = { phone: '' };
        vm.$validator = {
          validateAll: () => true,
        };

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.errors.clear).to.have.been.called;
        expect(vm.showPhone).to.equal(true);
        expect(vm.validPhone).to.equal(true);
        expect(vm.validChildren).to.equal(false);
        expect(vm.errors.add).to.have.been.calledWith('submitChildComponentsFailed');
      });

      it('should do nothing when setupSucceeded is false. showPhone is false and validChildren is true', async () => {
        // ARRANGE
        sandbox.stub(vm, 'checkValidatedChildComponents').callsFake(() => {
          vm.validChildren = true;
        });
        vm.user = { phone: '123498566986' };
        sandbox.stub(vm, 'setupPrerequisites').resolves(false);
        sandbox.stub(vm, 'bookTickets');

        // ACT
        await vm.submitBooking();

        // ASSERT
        expect(vm.errors.clear).to.have.been.called;
        expect(vm.showPhone).to.equal(false);
        expect(vm.validChildren).to.equal(true);
        expect(vm.setupPrerequisites).to.have.been.called;
        expect(vm.bookTickets).to.not.have.been.called;
        expect(vm.$router.push).to.not.have.been.called;
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
});
