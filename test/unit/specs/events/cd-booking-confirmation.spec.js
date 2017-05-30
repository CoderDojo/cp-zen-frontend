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
        phoneNumber: '+1-555-123456',
        email: 'john.doe@example.com',
      },
    };

    MockStoreService.load.returns(bookingData);
    const BookingConfirmationComponentWithMocks = BookingConfirmationComponent({
      '@/store/store-service': MockStoreService,
    });

    const data = {
      eventId: 1,
    };

    BookingConfirmationComponentWithMocks.methods.loadBookingData.bind(data)();

    expect(MockStoreService.load).to.be.calledOnce;
    expect(MockStoreService.load).to.have.been.calledWith(`booking-${data.eventId}`);
    expect(data.parent).to.deep.equal(bookingData.parent);
  });
});
