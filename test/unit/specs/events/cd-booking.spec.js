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
      validateForm: sandbox.stub(),
      getRecaptchaResponse: sandbox.stub(),
      submitAccount: sandbox.stub(),
    };
    MockBookingParentForm = {
      validateForm: sandbox.stub(),
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

  it('should validate form', async () => {
    // ARRANGE
    MockBookingCreateAccount.validateForm.returns(Promise.resolve(true));
    MockBookingCreateAccount.getRecaptchaResponse.returns('recaptchaResponse');
    MockBookingParentForm.validateForm.returns(true);

    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.$refs = {
      bookingCreateAccountRef: MockBookingCreateAccount,
      bookingParentFormRef: MockBookingParentForm,
    };

    // ACT
    const result = await vm.isValidChildForm();

    // ASSERT
    expect(MockBookingCreateAccount.getRecaptchaResponse).to.be.calledOnce;
    expect(MockBookingCreateAccount.validateForm).to.be.calledOnce;
    expect(MockBookingParentForm.validateForm).to.be.calledOnce;
    expect(result).to.equal(true);
  });

  it('should not validate form', async () => {
    // ARRANGE
    MockBookingCreateAccount.getRecaptchaResponse.returns(null);

    const vm = vueUnitHelper(BookingComponentWithMocks);
    vm.$refs = {
      bookingCreateAccountRef: MockBookingCreateAccount,
      bookingParentFormRef: MockBookingParentForm,
    };

    sandbox.stub(window, 'alert');

    // ACT
    const result = await vm.isValidChildForm();

    // ASSERT
    expect(result).to.equal(false);
    expect(MockBookingCreateAccount.getRecaptchaResponse).to.be.calledOnce;
    expect(MockBookingCreateAccount.validateForm).to.not.be.called;
    expect(MockBookingParentForm.validateForm).to.not.be.called;
    expect(window.alert).to.be.calledOnce;
  });

  it('should submit form and redirect', async () => {
    // ARRANGE
    MockBookingCreateAccount.submitAccount.returns(Promise.resolve());

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
    await vm.onSubmit();

    // ASSERT
    expect(vm.isValidChildForm).to.be.calledOnce;
    expect(MockBookingParentForm.submitBooking).to.be.calledOnce;
    expect(MockBookingCreateAccount.submitAccount).to.be.calledOnce;
    expect(vm.$router.push).to.be.calledWith({ name: 'EventBookingConfirmation', params: { eventId: vm.eventId } });
  });
});
