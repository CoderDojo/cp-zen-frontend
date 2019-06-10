import vueUnitHelper from 'vue-unit-helper';
import formTicket from '@/events/form/form-tickets';

describe('Form Ticket component', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('sets default quantity', () => {
        // ARRANGE
        const vm = vueUnitHelper(formTicket);
        expect(vm.quantity).to.be.null;
        vm.defaultQuantity = 42;

        // ACT
        vm.$lifecycleMethods.created();

        // ASSERT
        expect(vm.quantity).to.equal(42);
      });
    });
  });

  // describe('computed', () => {
  //   describe('tickets', () => {
  //     it('should reference dom elements', () => {
  //       const vm = vueUnitHelper(FormTicketWithMocks);
  //       vm.$refs = {
  //         youthTickets: 'one',
  //         mentorTickets: 'two',
  //       };
  //       expect(vm.tickets).to.eql(['one', 'two']);
  //     });
  //   });
  // });
  //
  // describe.only('tethods', () => {
  //   describe('save', () => {
  //     it('should reference dom elements', async () => {
  //       const vm = vueUnitHelper(FormTicketWithMocks);
  //       const createTicket = sandbox.stub();
  //       const event = {
  //         preventDefault: sandbox.stub(),
  //       };
  //
  //       vm.tickets = [
  //         { createTicket },
  //         { createTicket },
  //       ];
  //       await vm.save(event);
  //       expect(event.preventDefault).to.have.been.calledOnce;
  //       expect(createTicket).to.have.been.calledTwice;
  //     });
  //   });
  // });
});
