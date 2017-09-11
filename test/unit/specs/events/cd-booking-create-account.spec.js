import vueUnitHelper from 'vue-unit-helper';
import { clone } from 'lodash';
import { ErrorBag } from 'vee-validate';
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
      joinDojo: sandbox.stub(),
    };
    MockEventsService = {
      bookTickets: sandbox.stub(),
    };
    MockUserUtils = {
      isYouthOverThirteen: sandbox.stub(),
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

  it('should register the user', (done) => {
    // ARRANGE
    const storedUserData = {
      firstName: 'Foo',
      lastName: 'Bar',
      phone: '012345678',
      email: 'foo.bar@baz.com',
    };
    MockStoreService.load.returns(storedUserData);

    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.eventId = 1;
    MockUsersService.register.returns(Promise.resolve());

    // ACT
    vm.register();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.profile).to.equal(storedUserData);
      expect(MockUsersService.register).to.have.been.calledWith(vm.user, storedUserData);
      done();
    });
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

      // ACT
      vm.submitAccount();

      // ASSERT
      requestAnimationFrame(() => {
        expect(vm.register).to.have.been.calledOnce;
        expect(vm.addChildren).to.have.been.calledOnce;
        expect(vm.joinDojo).to.have.been.calledOnce;
        expect(vm.bookTickets).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('form validation', () => {
    it('should return a valid form', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.errors = new ErrorBag();
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(true);
      expect(vm.formValidated).to.equal(true);
    });
    it('should return a invalid form without recaptcha and empty error', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = null;
      vm.errors = new ErrorBag();
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(false);
      expect(vm.formValidated).to.equal(true);
    });
    it('should return a invalid form without recaptcha and with errors', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = null;
      const bag = new ErrorBag();
      bag.add('oooo');
      vm.errors = bag;
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(false);
      expect(vm.formValidated).to.equal(true);
    });
    it('should return a invalid form with recaptcha and with errors', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'some recaptcha';
      const bag = new ErrorBag();
      bag.add('oooo');
      vm.errors = bag;
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(false);
      expect(vm.formValidated).to.equal(true);
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
    it('should create a profile for each child', (done) => {
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
      MockUsersService.addChild.callsFake((child) => {
        const childClone = clone(child);
        childClone.id = childIdCounter;
        childClone.userId = 1000 + childIdCounter;
        childIdCounter += 1;
        return Promise.resolve({ body: childClone });
      });

      // ACT
      vm.addChildren().then(() => {
        // ASSERT
        expect(MockUsersService.addChild).to.have.callCount(3);
        expect(MockUsersService.addChild.getCall(0).args[0]).to.deep.equal({
          firstName: 'Fee',
          lastName: 'Bar',
          dob: '2002-02-01T00:00:00.000Z',
          gender: 'Female',
          otherGender: '',
        });
        expect(MockUsersService.addChild.getCall(1).args[0]).to.deep.equal({
          firstName: 'Fie',
          lastName: 'Bar',
          dob: '2010-03-02T00:00:00.000Z',
          gender: 'Male',
          otherGender: '',
        });
        expect(MockUsersService.addChild.getCall(2).args[0]).to.deep.equal({
          firstName: 'Foe',
          lastName: 'Bar',
          dob: '2008-04-03T00:00:00.000Z',
          gender: 'Other',
          otherGender: 'Fluid',
        });
        expect(mockBookingData.foo.selectedTickets[0].user.id).to.equal(1);
        expect(mockBookingData.foo.selectedTickets[1].user.id).to.equal(2);
        expect(mockBookingData.abc.selectedTickets[0].user.id).to.equal(3);
        expect(mockBookingData.foo.selectedTickets[0].user.userId).to.equal(1001);
        expect(mockBookingData.foo.selectedTickets[1].user.userId).to.equal(1002);
        expect(mockBookingData.abc.selectedTickets[0].user.userId).to.equal(1003);
        expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}-sessions`, mockBookingData);
        done();
      });
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

      const currentUserResponseMock = {
        login: {},
        user: {
          id: userId,
        },
        ok: true,
      };

      // tell getcurrentuser what to return
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      // tell storeservice what to return for dojoId
      MockStoreService.load.withArgs('selected-event').returns({ dojoId });

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

      const currentUserResponseMock = {
        login: {},
        user: {
          id: userId,
        },
        ok: true,
      };

      // tell getcurrentuser what to return
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      // tell storeservice what to return for dojoId
      MockStoreService.load.withArgs('selected-event').returns({ dojoId });

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
      MockStoreService.load.withArgs('selected-event').returns(mockSelectedEvent);
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(mockBookingData);
      MockUsersService.getCurrentUser.returns(Promise.resolve({ body: currentUserResponseMock }));

      // ACT
      vm.bookTickets().then(() => {
        // ASSERT
        expect(MockEventsService.bookTickets).to.have.been.calledOnce;
        expect(MockEventsService.bookTickets).to.have.been.calledWith([
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
