import vueUnitHelper from 'vue-unit-helper';
import { clone } from 'lodash';
import BookingCreateAccountComponent from '!!vue-loader?inject!@/events/cd-booking-create-account';

describe('Booking Create Account Form', () => {
  let sandbox;
  let MockStoreService;
  let MockUsersService;
  let MockDojoService;
  let MockEventsService;
  let MockUserUtils;
  let BookingCreateAccountComponentWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      save: sandbox.stub(),
      load: sandbox.stub(),
    };
    MockUsersService = {
      register: sandbox.stub(),
      getCurrentUser: sandbox.stub(),
      addChild: sandbox.stub(),
    };
    MockDojoService = {
      getDojoById: sandbox.stub(),
      joinDojo: sandbox.stub(),
    };
    MockEventsService = {
      manageTickets: sandbox.stub(),
    };
    MockUserUtils = {
      isYouthOverThirteen: sandbox.stub(),
      isUnderAge: sandbox.stub(),
      getAge: sandbox.stub(),
      profileToJSON: sandbox.stub(),
    };

    BookingCreateAccountComponentWithMocks = BookingCreateAccountComponent({
      '@/store/store-service': MockStoreService,
      '@/users/service': MockUsersService,
      '@/dojos/service': MockDojoService,
      '@/users/util': MockUserUtils,
      '@/events/service': MockEventsService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('created', () => {
    it('should recover the selectedEvent and the Dojo', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      const mockEventData = {
        id: 1,
        dojoId: 2,
      };
      const mockDojoData = {
        id: 2,
        name: 'dojoData',
      };
      MockStoreService.load.withArgs('selected-event').returns(mockEventData);
      MockDojoService.getDojoById.withArgs(mockEventData.dojoId)
        .returns(Promise.resolve({ data: mockDojoData }));
      // ACT
      await vm.$lifecycleMethods.created();
      expect(MockStoreService.load).to.have.been.calledOnce;
      expect(vm.selectedEvent).to.equal(mockEventData);
      expect(MockDojoService.getDojoById).to.have.been.calledOnce;
      expect(vm.dojo).to.equal(mockDojoData);
    });
  });

  it('should generate user computed property', () => {
    // ARRANGE
    const expectedUser = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-123456',
      email: 'john.doe@example.com',
      password: 'Passw0rd',
      'g-recaptcha-response': 'abc123',
      initUserType: {
        title: 'Parent/Guardian',
        name: 'parent-guardian',
      },
      termsConditionsAccepted: true,
      mailingList: true,
    };
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      dob: '1980-04-12T00:00:00.000Z',
      phone: '+1-555-123456',
      email: 'john.doe@example.com',
      country: {
        alpha2: 'FR',
      },
    };
    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.profile = clone(profile);
    vm.password = 'Passw0rd';
    vm.recaptchaResponse = 'abc123';
    vm.termsConditionsAccepted = true;
    vm.isSubscribedToMailingList = true;

    // ACT
    const user = vm.user;

    // ASSERT
    expect(user).to.deep.equal(expectedUser);
    expect(vm.profile).to.deep.equal(profile);
  });

  it('should register the user and notify GA that an adult registered', async () => {
    // ARRANGE
    MockUserUtils.profileToJSON.callsFake(profile => profile);

    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.eventId = 1;
    vm.$ga = { event: sinon.stub() };
    vm.$route = { name: 'a' };
    vm.profile = {
      firstName: 'Foo',
      lastName: 'Bar',
      phone: '012345678',
      email: 'foo.bar@baz.com',
      dob: '',
    };
    vm.user = {
      id: 'foo',
    };
    MockUsersService.register.returns(Promise.resolve());
    MockUserUtils.getAge.returns('42');
    MockUserUtils.profileToJSON.callsFake(profile => profile);

    // ACT
    await vm.register();

    // ASSERT
    expect(vm.profile).to.equal(vm.profile);
    expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'register_adult');
    expect(MockUsersService.register).to.have.been.calledWith(vm.user, vm.profile);
  });

  it('should register the user and notify GA that a kid registered', async () => {
    // ARRANGE
    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.eventId = 1;
    vm.$ga = { event: sinon.stub() };
    vm.$route = { name: 'a' };
    vm.profile = {
      firstName: 'Foo',
      lastName: 'Bar',
      phone: '012345678',
      email: 'foo.bar@baz.com',
      dob: '',
    };
    vm.user = {
      id: 'foo',
    };
    MockUsersService.register.returns(Promise.resolve());
    MockUserUtils.getAge.returns('17');
    MockUserUtils.profileToJSON.callsFake(profile => profile);

    // ACT
    vm.register();

    // ASSERT
    expect(vm.profile).to.equal(vm.profile);
    expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'register_kid');
    expect(MockUsersService.register).to.have.been.calledWith(vm.user, vm.profile);
  });

  describe('submitAccount()', () => {
    it('should call register, addChildren, joinDojo and bookTickets', (done) => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.eventId = 1;

      sandbox.stub(vm, 'register').returns(Promise.resolve());
      sandbox.stub(vm, 'joinDojo').returns(Promise.resolve());
      sandbox.stub(vm, 'bookTickets').returns(Promise.resolve());
      sandbox.stub(vm, 'addChildren').returns(Promise.resolve());
      sandbox.stub(vm, 'prepareProfile').returns(Promise.resolve());

      // ACT
      vm.submitAccount();

      // ASSERT
      requestAnimationFrame(() => {
        expect(vm.prepareProfile).to.have.been.calledOnce;
        expect(vm.register).to.have.been.calledOnce;
        expect(vm.addChildren).to.have.been.calledOnce;
        expect(vm.joinDojo).to.have.been.calledOnce;
        expect(vm.bookTickets).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('validateForm()', () => {
    it('should return true when form is valid and recaptchaResponse exists', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.$validator = {
        validateAll: () => true,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(true);
    });

    it('should return false when form is valid and recaptchaResponse does not exist', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = undefined;
      vm.$validator = {
        validateAll: () => true,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });

    it('should return false when form is invalid and recaptchaResponse exists', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.$validator = {
        validateAll: () => false,
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });

    it('should return false when validateAll throws an error', async () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.$validator = {
        validateAll: () => {
          throw new Error('Invalid form');
        },
      };

      // ACT
      const isValid = await vm.validateForm();

      // ASSERT
      expect(isValid).to.equal(false);
    });
  });

  it('should store recaptchaResponse on verification', () => {
    // ARRANGE
    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);

    // ACT
    vm.onRecaptchaVerify('foo');

    // ASSERT
    expect(vm.recaptchaResponse).to.equal('foo');
  });

  describe('addChildren', () => {
    it('should create a profile for each child', async () => {
      // ARRANGE
      const mockBookingData = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                type: 'ninja',
              },
              user: {
                firstName: 'Fee',
                lastName: 'Bar',
                dob: '2002-02-01T00:00:00.000Z',
                gender: 'Female',
                otherGender: '',
              },
            },
            {
              ticket: {
                id: 'foo',
                type: 'ninja',
              },
              user: {
                firstName: 'Fie',
                lastName: 'Bar',
                dob: '2010-03-02T00:00:00.000Z',
                gender: 'Male',
                otherGender: '',
              },
            },
          ],
        },
        abc: {
          session: 'xyz',
          selectedTickets: [
            {
              ticket: {
                id: 'abc',
                type: 'ninja',
              },
              user: {
                firstName: 'Foe',
                lastName: 'Bar',
                dob: '2008-04-03T00:00:00.000Z',
                gender: 'Other',
                otherGender: 'Fluid',
              },
            },
          ],
        },
      };

      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.eventId = 1;
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(mockBookingData);
      let childIdCounter = 1;
      MockUserUtils.profileToJSON.callsFake(child => child);
      MockUsersService.addChild.callsFake((child) => {
        const childClone = clone(child);
        childClone.id = childIdCounter;
        childClone.userId = 1000 + childIdCounter;
        childIdCounter += 1;
        return Promise.resolve({ body: childClone });
      });
      MockUserUtils.isUnderAge.withArgs('2002-02-01T00:00:00.000Z').returns(false);
      MockUserUtils.isUnderAge.withArgs('2010-03-02T00:00:00.000Z').returns(true);
      MockUserUtils.isUnderAge.withArgs('2008-04-03T00:00:00.000Z').returns(true);

      // ACT
      await vm.addChildren();
      // ASSERT
      expect(MockUserUtils.profileToJSON).to.have.callCount(3);
      expect(MockUsersService.addChild).to.have.callCount(3);
      expect(MockUsersService.addChild.getCall(0).args[0]).to.deep.equal({
        firstName: 'Fee',
        lastName: 'Bar',
        dob: '2002-02-01T00:00:00.000Z',
        gender: 'Female',
        userTypes: ['attendee-o13'],
      });
      expect(MockUsersService.addChild.getCall(1).args[0]).to.deep.equal({
        firstName: 'Fie',
        lastName: 'Bar',
        dob: '2010-03-02T00:00:00.000Z',
        gender: 'Male',
        userTypes: ['attendee-u13'],
      });
      expect(MockUsersService.addChild.getCall(2).args[0]).to.deep.equal({
        firstName: 'Foe',
        lastName: 'Bar',
        dob: '2008-04-03T00:00:00.000Z',
        gender: 'Fluid',
        userTypes: ['attendee-u13'],
      });
      expect(mockBookingData.foo.selectedTickets[0].user.id).to.equal(1);
      expect(mockBookingData.foo.selectedTickets[1].user.id).to.equal(2);
      expect(mockBookingData.abc.selectedTickets[0].user.id).to.equal(3);
      expect(mockBookingData.foo.selectedTickets[0].user.userId).to.equal(1001);
      expect(mockBookingData.foo.selectedTickets[1].user.userId).to.equal(1002);
      expect(mockBookingData.abc.selectedTickets[0].user.userId).to.equal(1003);
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, mockBookingData);
    });
  });

  describe('prepareProfile', () => {
    it('should fill the country from the Dojo', () => {
      //  ARRANGE
      const mockProfileData = {
        firstName: 'Foo',
        lastName: 'Bar',
        phone: '012345678',
        email: 'foo.bar@baz.com',
        dob: '',
      };
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.dojo = {
        country: {
          alpha2: 'FR',
        },
      };
      vm.eventId = 1;
      const expectedProfileData = Object.assign({}, mockProfileData, vm.dojo);
      MockStoreService.load.returns(mockProfileData);

      vm.prepareProfile();
      expect(MockStoreService.load).to.have.been.calledOnce;
      expect(MockStoreService.load).to.have.been.calledWith('booking-1-user');
      expect(vm.profile.country).to.eql(expectedProfileData.country);
      expect(MockStoreService.save).to.have.been.calledOnce;
      expect(MockStoreService.save).to.have.been.calledWith('booking-1-user', expectedProfileData);
    });
  });

  describe('joinDojo', () => {
    it('should join the logged in user to the dojo as a parent', (done) => {
      // ARRANGE
      const userId = '74afa4b8-8449-46e4-a553-8febda8614ad';
      const dojoId = '4e591bbe-667b-4782-bc9c-180c6d321883';
      const eventId = '1c4a3f87-7a8e-4101-b332-b02b021a42f7';
      const userTypes = ['parent-guardian'];
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.eventId = eventId;
      vm.profile = { dob: '' };
      vm.selectedEvent = { dojoId };
      const currentUserResponseMock = {
        login: {},
        user: {
          id: userId,
        },
        ok: true,
      };

      // tell getcurrentuser what to return
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      MockUserUtils.isYouthOverThirteen.returns(false);

      // ACT
      vm.joinDojo().then(() => {
        // ASSERT
        expect(MockDojoService.joinDojo).to.have.been.calledWith(userId, dojoId, userTypes);
        done();
      });
    });
    it('should join the logged in user to the dojo as an o13', (done) => {
      // ARRANGE
      const userId = '74afa4b8-8449-46e4-a553-8febda8614ad';
      const dojoId = '4e591bbe-667b-4782-bc9c-180c6d321883';
      const eventId = '1c4a3f87-7a8e-4101-b332-b02b021a42f7';
      const userTypes = ['attendee-o13'];
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.eventId = eventId;
      vm.profile = { dob: '' };
      vm.selectedEvent = { dojoId };
      const currentUserResponseMock = {
        login: {},
        user: {
          id: userId,
        },
        ok: true,
      };

      // tell getcurrentuser what to return
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      MockUserUtils.isYouthOverThirteen.returns(true);

      // ACT
      vm.joinDojo().then(() => {
        // ASSERT
        expect(MockDojoService.joinDojo).to.have.been.calledWith(userId, dojoId, userTypes);
        done();
      });
    });
  });

  describe('bookTickets()', () => {
    it('should put together a list of applications and send them to event service to book', (done) => {
      // ARRANGE
      const currentUserResponseMock = {
        login: {},
        user: {
          id: 'foo',
        },
        ok: true,
      };
      const mockSelectedEvent = {
        id: 'foo',
        dojoId: 'dojo1',
      };
      const mockBookingData = {
        foo: {
          session: 'bar',
          selectedTickets: [
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
                type: 'ninja',
              },
              user: {
                userId: 1,
              },
            },
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
                type: 'ninja',
              },
              user: {
                userId: 2,
              },
            },
          ],
        },
        abc: {
          session: 'xyz',
          selectedTickets: [
            {
              ticket: {
                id: 'abc',
                name: 'ABC',
                sessionId: 'xyz',
                type: 'parent-guardian',
              },
            },
          ],
        },
      };
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.eventId = 'foo';
      vm.$ga = { event: sinon.stub() };
      vm.$route = { name: '' };
      vm.selectedEvent = mockSelectedEvent;
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(mockBookingData);
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      // ACT
      vm.bookTickets().then(() => {
        // ASSERT
        expect(vm.$ga.event).to.have.been.calledWith(vm.$route.name, 'click', 'book_tickets');
        expect(MockEventsService.manageTickets).to.have.been.calledOnce;
        expect(MockEventsService.manageTickets).to.have.been.calledWith([
          {
            dojoId: mockSelectedEvent.dojoId,
            eventId: mockSelectedEvent.id,
            sessionId: 'bar',
            ticketName: 'Foo',
            ticketType: 'ninja',
            ticketId: 'foo',
            userId: 1,
            notes: 'N/A',
          },
          {
            dojoId: mockSelectedEvent.dojoId,
            eventId: mockSelectedEvent.id,
            sessionId: 'bar',
            ticketName: 'Foo',
            ticketType: 'ninja',
            ticketId: 'foo',
            userId: 2,
            notes: 'N/A',
          },
          {
            dojoId: mockSelectedEvent.dojoId,
            eventId: mockSelectedEvent.id,
            sessionId: 'xyz',
            ticketName: 'ABC',
            ticketType: 'parent-guardian',
            ticketId: 'abc',
            userId: 'foo',
            notes: 'N/A',
          },
        ]);
        done();
      });
    });
  });
});
