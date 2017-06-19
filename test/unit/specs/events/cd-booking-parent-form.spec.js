import vueUnitHelper from 'vue-unit-helper';
import BookingParentFormComponent from '!!vue-loader?inject!@/events/cd-booking-parent-form';
import { pick } from 'lodash';
import { ErrorBag } from 'vee-validate';

describe('Booking Parent Form', () => {
  const MockStoreService = {
    save: sinon.spy(),
  };
  const BookingParentFormComponentWithMocks = BookingParentFormComponent({
    '@/store/store-service': MockStoreService,
  });

  it('should store parent data and navigate to confirmation page', () => {
    // ARRANGE
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
  });

  describe('form validation', () => {
    it('should return a valid form', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
      vm.errors = new ErrorBag();
      vm.formValidated = false;

      // ACT
      const isValid = vm.isValid();

      // ASSERT
      expect(isValid).to.equal(true);
      expect(vm.formValidated).to.equal(true);
    });
    it('should return a invalid form with errors', () => {
      // ARRANGE
      const vm = vueUnitHelper(BookingParentFormComponentWithMocks);
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
