import vueUnitHelper from 'vue-unit-helper';
import TicketListItemComponent from '!!vue-loader?inject!@/events/cd-user-ticket-list-item';

describe('Ticket list item component', () => {
  let MockEventsService;
  let TicketListItemComponentWithMocks;

  beforeEach(() => {
    MockEventsService = {
      manageTickets: sinon.stub(),
    };
    // window.alert = sinon.stub();
    TicketListItemComponentWithMocks = TicketListItemComponent({
      './service': MockEventsService,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('computed', () => {
    describe('hasApplications', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(TicketListItemComponentWithMocks);
        vm.applications = {};
      });

      it('should return true if the user has any application for the current event', () => {
        // ARRANGE
        vm.applications = [{}];

        // ACT & ASSERT
        expect(vm.hasApplications).to.equal(true);
      });

      it('should return false if the user has no application for the current event', () => {
        // ARRANGE
        vm.applications = [];

        // ACT & ASSERT
        expect(vm.hasApplications).to.equal(false);
      });
    });

    describe('cancel', () => {
      it('should call manageTickets with the right args', () => {
        // ARRANGE
        const vm = vueUnitHelper(TicketListItemComponentWithMocks);
        vm.applications = [{
          dojoId: 1,
          eventId: 2,
          sessionId: 3,
          ticketName: 'ticket',
          ticketType: 'parent-guardian',
          ticketId: 4,
          userId: 5,
          notes: 'empty',
        }];
        MockEventsService.manageTickets.returns(Promise.resolve());
        // eslint-disable-next-line no-param-reassign
        const expectedPayload = vm.applications.map((app) => { app.deleted = true; return app; });
        // ACT
        vm.cancel();
        // ASSERT
        requestAnimationFrame(() => {
          expect(MockEventsService.manageTickets).to.have.been.deep.calledWith(expectedPayload);
          expect(vm.applications).to.be.empty();
          expect(window.alert).to.have.been.calledOnce();
        });
      });
    });
  });
});
