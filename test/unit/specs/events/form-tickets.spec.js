import vueUnitHelper from 'vue-unit-helper';
import formTicket from '@/events/form/form-tickets';

describe('Form Ticket component', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('lifecycle functions', () => {
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
});
