import vueUnitHelper from 'vue-unit-helper';
import { clone } from 'lodash';
import { ErrorBag } from 'vee-validate';
import BookingCreateAccountComponent from '!!vue-loader?inject!@/events/cd-booking-create-account';

describe('Booking Create Account Form', () => {
  const sandbox = sinon.sandbox.create();
  const MockStoreService = {
    save: sandbox.stub(),
    load: sandbox.stub(),
  };
  const MockUsersService = {
    register: sandbox.stub(),
    getCurrentUser: sandbox.stub(),
    addChild: sandbox.stub(),
  };
  const MockDojoService = {
    joinDojo: sandbox.stub(),
  };
  const MockEventsService = {
    bookTickets: sandbox.stub(),
  };

  const BookingCreateAccountComponentWithMocks = BookingCreateAccountComponent({
    '@/store/store-service': MockStoreService,
    '@/users/service': MockUsersService,
    '@/dojos/service': MockDojoService,
    '@/events/service': MockEventsService,
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
    };
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-123456',
      email: 'john.doe@example.com',
    };
    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.profile = clone(profile);
    vm.password = 'Passw0rd';
    vm.recaptchaResponse = 'abc123';
    vm.termsConditionsAccepted = true;

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
                dob: {
                  date: '1',
                  month: '2',
                  year: '2002',
                },
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
                dob: {
                  date: '2',
                  month: '3',
                  year: '2010',
                },
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
                dob: {
                  date: '3',
                  month: '4',
                  year: '2008',
                },
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
          dob: new Date(2002, 1, 1, 0, 0, 0, 0),
          gender: 'Female',
          otherGender: '',
        });
        expect(MockUsersService.addChild.getCall(1).args[0]).to.deep.equal({
          firstName: 'Fie',
          lastName: 'Bar',
          dob: new Date(2010, 2, 2, 0, 0, 0, 0),
          gender: 'Male',
          otherGender: '',
        });
        expect(MockUsersService.addChild.getCall(2).args[0]).to.deep.equal({
          firstName: 'Foe',
          lastName: 'Bar',
          dob: new Date(2008, 3, 3, 0, 0, 0, 0),
          gender: 'Other',
          otherGender: 'Fluid',
        });
        expect(mockBookingData.foo.selectedTickets[0].user.id).to.equal(1);
        expect(mockBookingData.foo.selectedTickets[1].user.id).to.equal(2);
        expect(mockBookingData.abc.selectedTickets[0].user.id).to.equal(3);
        done();
      });
    });
  });

  describe('joinDojo', () => {
    it('should join the logged in user to the dojo', (done) => {
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

      // ACT
      vm.joinDojo().then(() => {
        // ASSERT
        expect(MockDojoService.joinDojo).to.have.been.calledWith(userId, dojoId, userTypes);
        done();
      });
    });
  });

  describe('bookTickets()', () => {
    it('should put together a list of applications and send them to event service to book', () => {
      // ARRANGE
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
              },
              user: {
                id: 1,
              },
            },
            {
              ticket: {
                id: 'foo',
                name: 'Foo',
                sessionId: 'bar',
              },
              user: {
                id: 2,
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
              },
              user: {
                id: 3,
              },
            },
          ],
        },
      };
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.eventId = 'foo';
      MockStoreService.load.withArgs('selected-event').returns(mockSelectedEvent);
      MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(mockBookingData);

      // ACT
      vm.bookTickets();

      // ASSERT
      expect(MockEventsService.bookTickets).to.have.been.calledWith([
        {
          dojoId: mockSelectedEvent.dojoId,
          eventId: mockSelectedEvent.id,
          sessionId: 'bar',
          ticketName: 'Foo',
          ticketId: 'foo',
          userId: 1,
          notes: 'N/A',
        },
        {
          dojoId: mockSelectedEvent.dojoId,
          eventId: mockSelectedEvent.id,
          sessionId: 'bar',
          ticketName: 'Foo',
          ticketId: 'foo',
          userId: 2,
          notes: 'N/A',
        },
        {
          dojoId: mockSelectedEvent.dojoId,
          eventId: mockSelectedEvent.id,
          sessionId: 'xyz',
          ticketName: 'ABC',
          ticketId: 'abc',
          userId: 3,
          notes: 'N/A',
        },
      ]);
    });
  });
});
