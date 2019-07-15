import vueUnitHelper from 'vue-unit-helper';
import formTicket from '!!vue-loader?inject!@/events/form/form-tickets';

describe('Form Ticket component', () => {
  let FormTicketWithMocks;
  let MockEventStore;

  beforeEach(() => {
    MockEventStore = {
      commit: sinon.stub(),
      getters: {
        ticketQuantity: sinon.stub().returns(5),
      },
    };

    FormTicketWithMocks = formTicket({
      '@/events/event-store': MockEventStore,
    });
  });


  afterEach(() => {
    sinon.restore();
  });

  describe('computed', () => {
    describe('ticketQuantity', () => {
      it('returns value from event store', () => {
        const vm = vueUnitHelper(FormTicketWithMocks);
        expect(vm.ticketQuantity).to.eql(5);
      });
      it('updates value to event store', () => {
        const vm = vueUnitHelper(FormTicketWithMocks);
        vm.type = 'ticket-type';
        vm.ticketQuantity = 6;
        expect(MockEventStore.commit).to.have.been.calledOnce
          .and.calledWith('updateTicketQuantity', { quantity: 6, type: 'ticket-type' });
      });
    });
  });
});
