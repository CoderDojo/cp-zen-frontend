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
    const bookingDataMock = {
      foo: {
        session: 'bar',
        selectedTickets: [
          {
            ticket: { id: 'foo' },
          },
        ],
      },
    };
    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.eventId = 'foo';

    MockStoreService.load.withArgs(`booking-${vm.eventId}-sessions`).returns(bookingDataMock);

    // ACT
    vm.loadSessionData();

    // ASSERT
    expect(MockStoreService.load).to.be.calledOnce;
    expect(MockStoreService.load).to.be.calledWith(`booking-${vm.eventId}-sessions`);
    expect(vm.tickets).to.deep.equal(bookingDataMock);
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

  it('should submit form and redirect', (done) => {
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
    MockBookingCreateAccount.submitAccount.returns(Promise.resolve());

    // ACT
    vm.onSubmit();

    // ASSERT
    requestAnimationFrame(() => {
      expect(vm.isValidChildForm).to.be.calledOnce;
      expect(MockBookingParentForm.submitBooking).to.be.calledOnce;
      expect(MockBookingCreateAccount.submitAccount).to.be.calledOnce;
      expect(vm.$router.push).to.be.calledWith({ name: 'EventBookingConfirmation', params: { eventId: vm.eventId } });
      done();
    });
  });
});
