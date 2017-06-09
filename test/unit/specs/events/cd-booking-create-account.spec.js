import vueUnitHelper from 'vue-unit-helper';
import { clone } from 'lodash';
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
  };
  const MockDojoService = {
    joinDojo: sandbox.stub(),
  };
  const BookingCreateAccountComponentWithMocks = BookingCreateAccountComponent({
    '@/store/store-service': MockStoreService,
    '@/users/service': MockUsersService,
    '@/dojos/service': MockDojoService,
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
    const parent = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-123456',
      email: 'john.doe@example.com',
    };
    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.parent = clone(parent);
    vm.password = 'Passw0rd';
    vm.recaptchaResponse = 'abc123';
    vm.termsConditionsAccepted = true;

    // ACT
    const user = vm.user;

    // ASSERT
    expect(user).to.deep.equal(expectedUser);
    expect(vm.parent).to.deep.equal(parent);
  });

  it('should register the user', (done) => {
    // ARRANGE
    const storedBookingData = {
      parent: {
        firstName: 'Foo',
        lastName: 'Bar',
        phone: '012345678',
        email: 'foo.bar@baz.com',
      },
    };
    MockStoreService.load.returns(storedBookingData);

    const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
    vm.user = {
      firstName: 'Foo',
      lastName: 'Bar',
      phone: '012345678',
      email: 'foo.bar@baz.com',
      password: 'Passw0rd',
      'g-recaptcha-response': 'abc123',
      initUserType: {
        title: 'Parent/Guardian',
        name: 'parent-guardian',
      },
    };
    vm.eventId = 1;
    MockUsersService.register.returns(Promise.resolve());

    // ACT
    vm.register();

    // ASSERT
    requestAnimationFrame(() => {
      expect(MockUsersService.register).to.have.been.calledWith(vm.user, storedBookingData.parent);
      expect(MockStoreService.save).to.have.been.calledWith(`booking-${vm.eventId}`, {
        parent: storedBookingData.parent,
        accountCreated: true,
      });
      done();
    });
  });

  describe('onValidate()', () => {
    it('should call register if there is no error', (done) => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.errors = {
        any: () => false,
      };
      vm.eventId = 1;
      vm.$router = {
        push: sinon.stub(),
      };

      sandbox.stub(vm, 'register').returns(Promise.resolve());
      sandbox.stub(vm, 'joinDojo').returns(Promise.resolve());

      // ACT
      vm.onValidate();

      // ASSERT
      requestAnimationFrame(() => {
        expect(vm.register).to.have.been.calledOnce;
        expect(vm.joinDojo).to.have.been.calledOnce;
        expect(vm.$router.push).to.have.been.calledWith(`/events/${vm.eventId}/confirmation`);
        done();
      });
    });

    it('should validate recaptcha', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.errors = {
        any: () => false,
      };

      sandbox.stub(vm, 'register');
      sandbox.stub(window, 'alert');

      vm.onValidate();

      // ASSERT
      expect(vm.register).not.to.have.been.called;
      expect(window.alert).to.have.been.calledWith('Please complete reCAPTCHA');
    });

    it('should not call register if there is an error', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingCreateAccountComponentWithMocks);
      vm.recaptchaResponse = 'foo';
      vm.errors = {
        any: () => true,
      };

      sandbox.stub(vm, 'register');

      // ACT
      vm.onValidate();

      // ASSERT
      expect(vm.register).not.to.have.been.called;
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
});
