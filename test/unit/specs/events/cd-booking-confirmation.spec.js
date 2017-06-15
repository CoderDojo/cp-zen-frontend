import vueUnitHelper from 'vue-unit-helper';
import BookingConfirmationComponent from '!!vue-loader?inject!@/events/cd-booking-confirmation';

describe('Booking Confirmation Component', () => {
  it('should show parent data from store', () => {
    const MockStoreService = {
      load: sinon.stub(),
    };
    const bookingData = {
      parent: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-123456',
        email: 'john.doe@example.com',
      },
      children: ['child1', 'child2'],
    };

    MockStoreService.load.returns(bookingData);
    const BookingConfirmationComponentWithMocks = BookingConfirmationComponent({
      '@/store/store-service': MockStoreService,
    });

    const vm = vueUnitHelper(BookingConfirmationComponentWithMocks);
    vm.eventId = 1;

    vm.loadBookingData();

    expect(MockStoreService.load).to.be.calledOnce;
    expect(MockStoreService.load).to.have.been.calledWith(`booking-${vm.eventId}`);
    expect(vm.parent).to.deep.equal(bookingData.parent);
    expect(vm.children).to.deep.equal(bookingData.children);
  });
});
