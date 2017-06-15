import vueUnitHelper from 'vue-unit-helper';
import BookingParentFormComponent from '!!vue-loader?inject!@/events/cd-booking-parent-form';
import { pick } from 'lodash';

describe('Booking Parent Form', () => {
  it('should store parent data and navigate to confirmation page', () => {
    // ARRANGE
    const MockStoreService = {
      save: sinon.spy(),
    };
    const BookingParentFormComponentWithMocks = BookingParentFormComponent({
      '@/store/store-service': MockStoreService,
    });

    const parentData = {
      eventId: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '1555123456',
      email: 'john.doe@example.com',
      childrenFormData: ['child1', 'child2'],
      $router: {
        push: sinon.spy(),
      },
    };

    const vm = vueUnitHelper(BookingParentFormComponentWithMocks);

    // ACT
    vm.submitBooking.bind(parentData)();

    // ASSERT
    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith(`booking-${parentData.eventId}`,
      { parent: pick(parentData, ['firstName', 'lastName', 'phone', 'email']), children: parentData.childrenFormData });
    expect(parentData.$router.push).to.be.calledOnce;
    expect(parentData.$router.push).to.have.been.calledWith(`/events/${parentData.eventId}/create-account`);
  });

  describe('parentForm.doValidate()', () => {
    it('should not call submitBooking if validation errors are present', () => {
      // ARRANGE
      const BookingParentFormComponentWithMocks = BookingParentFormComponent();
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);

      vm.submitBooking = sinon.spy();
      vm.errors = {
        any: () => true,
      };

      // ACT
      vm.doValidate();

      // ASSERT
      expect(vm.formValidated).to.be.true;
      expect(vm.submitBooking).to.not.have.been.called;
    });
    it('should call submitBooking if no validation errors are present', () => {
      // ARRANGE
      const BookingParentFormComponentWithMocks = BookingParentFormComponent();
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);

      vm.submitBooking = sinon.spy();
      vm.errors = {
        any: () => false,
      };

      // ACT
      vm.doValidate();

      // ASSERT
      expect(vm.formValidated).to.be.true;
      expect(vm.submitBooking).to.have.been.calledOnce;
    });
  });

  describe('computed.ninjaTickets', () => {
    it('should return ninja tickets only', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponent());
      vm.tickets = [
        {
          id: 'ticket-1',
          name: 'U13',
          type: 'ninja',
          quantity: 2,
        },
        {
          id: 'ticket-2',
          name: 'Parent',
          type: 'parent-guardian',
          quantity: 1,
        },
        {
          id: 'ticket-3',
          name: 'O13',
          type: 'ninja',
          quantity: 1,
        },
      ];

      // ASSERT
      expect(vm.ninjaTickets).to.deep.equal([
        {
          id: 'ticket-1',
          name: 'U13',
          type: 'ninja',
          quantity: 2,
        },
        {
          id: 'ticket-1',
          name: 'U13',
          type: 'ninja',
          quantity: 2,
        },
        {
          id: 'ticket-3',
          name: 'O13',
          type: 'ninja',
          quantity: 1,
        },
      ]);
    });
  });
});
