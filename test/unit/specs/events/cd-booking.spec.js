import vueUnitHelper from 'vue-unit-helper';
import BookingComponent from '!!vue-loader?inject!@/events/cd-booking';

describe('Booking Page', () => {
  let MockStoreService;
  let BookingComponentWithMocks;
  let MockBookingCreateAccount;
  let MockBookingParentForm;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockStoreService = {
      load: sandbox.stub(),
    };
    BookingComponentWithMocks = BookingComponent({
      '@/store/store-service': MockStoreService,
    });

    MockBookingCreateAccount = {
      isValid: sandbox.stub(),
      getRecaptchaResponse: sandbox.stub(),
      submitAccount: sandbox.stub(),
    };
    MockBookingParentForm = {
      isValid: sandbox.stub(),
      submitBooking: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should load saved sessions data', () => {
    // ARRANGE
    const vm = vueUnitHelper(BookingComponentWithMocks);

    MockStoreService.load.withArgs('selected-event').returns({
      sessions: [
        {
          name: 'Session 1',
          id: 'abc',
          tickets: [
            {
              id: 'ticket-1',
              name: 'Ticket 1',
              type: 'type-a',
            },
            {
              id: 'ticket-2',
              name: 'Ticket 2',
              type: 'type-b',
            },
          ],
        },
        {
          name: 'Session 2',
          id: 'xyz',
          tickets: [
            {
              id: 'ticket-100',
              name: 'Ticket 100',
              type: 'type-c',
            },
            {
              id: 'ticket-101',
              name: 'Ticket 101',
              type: 'type-d',
            },
          ],
        },
      ],
    });

    MockStoreService.load.withArgs('booking-sessions').returns({
      abc: {
        'ticket-1': 2,
      },
      def: {
        'ticket-50': 50,
      },
      xyz: {
        'ticket-100': 100,
      },
    });

    // ACT
    const bindingData = { tickets: [] };
    vm.loadSessionData.bind(bindingData)();

    // ASSERT
    expect(MockStoreService.load).to.be.calledTwice;
    expect(MockStoreService.load).to.be.calledWith('selected-event');
    expect(MockStoreService.load).to.be.calledWith('booking-sessions');
    expect(bindingData.tickets).to.deep.equal(
      [
        { id: 'ticket-1', name: 'Ticket 1', quantity: 2, sessionName: 'Session 1', type: 'type-a' },
        { id: 'ticket-100', name: 'Ticket 100', quantity: 100, sessionName: 'Session 2', type: 'type-c' },
      ]);
  });

  it('should validate form', () => {
    // ARRANGE
    MockBookingCreateAccount.isValid.returns(true);
    MockBookingCreateAccount.getRecaptchaResponse.returns('recaptchaResponse');
    MockBookingParentForm.isValid.returns(true);

    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.$refs = {
      bookingCreateAccountRef: MockBookingCreateAccount,
      bookingParentFormRef: MockBookingParentForm,
    };

    // ACT
    const result = vm.isValidChildForm();

    // ASSERT
    expect(MockBookingCreateAccount.getRecaptchaResponse).to.be.calledOnce;
    expect(MockBookingCreateAccount.isValid).to.be.calledOnce;
    expect(MockBookingParentForm.isValid).to.be.calledOnce;
    expect(result).to.equal(true);
  });

  it('should not validate form', () => {
    // ARRANGE
    MockBookingCreateAccount.getRecaptchaResponse.returns(null);

    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.$refs = {
      bookingCreateAccountRef: MockBookingCreateAccount,
      bookingParentFormRef: MockBookingParentForm,
    };

    sandbox.stub(window, 'alert');

    // ACT
    const result = vm.isValidChildForm();

    // ASSERT
    expect(result).to.equal(false);
    expect(MockBookingCreateAccount.getRecaptchaResponse).to.be.calledOnce;
    expect(MockBookingCreateAccount.isValid).to.not.be.called;
    expect(MockBookingParentForm.isValid).to.not.be.called;
    expect(window.alert).to.be.calledOnce;
  });

  it('should submit form and redirect', () => {
    // ARRANGE
    MockBookingCreateAccount.getRecaptchaResponse.returns('recaptcha');
    MockBookingCreateAccount.isValid.returns(true);
    MockBookingParentForm.isValid.returns(true);

    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.eventId = 1;
    vm.$refs = {
      bookingCreateAccountRef: MockBookingCreateAccount,
      bookingParentFormRef: MockBookingParentForm,
    };
    vm.$router = {
      push: sandbox.spy(),
    };
    sandbox.stub(vm, 'isValidChildForm').returns(true);

    // ACT
    vm.onSubmit();

    // ASSERT
    expect(vm.isValidChildForm).to.be.calledOnce;
    expect(MockBookingParentForm.submitBooking).to.be.calledOnce;
    expect(MockBookingCreateAccount.submitAccount).to.be.calledOnce;
    expect(vm.$router.push).to.be.calledWith('/events/1/confirmation');
  });
});
