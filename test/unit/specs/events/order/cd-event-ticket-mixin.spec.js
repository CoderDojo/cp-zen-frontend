import vueUnitHelper from 'vue-unit-helper';
import EventListItem from '@/events/order/cd-event-ticket-mixin';

describe('Event ticket mixin component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('tickets', () => {
      it('should return the full list of tickets from the sessions', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
          sessions: [
            {
              tickets: [
                {
                  id: 1,
                },
                {
                  id: 2,
                },
              ],
            },
            {
              tickets: [
                {
                  id: 3,
                },
                {
                  id: 4,
                },
              ],
            },
          ],
        };
        expect(vm.tickets).to.deep.equal([
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 4,
          },
        ]);
      });
    });
  });
  describe('methods', () => {
    describe('ticketIsFull', () => {
      it('should return false when there is plenty of tickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const ticket = {
          approvedApplications: 4,
          quantity: 42,
        };
        const res = vm.ticketIsFull(ticket);
        // ACT & ASSERT
        expect(res).to.be.false;
      });
      it('should return false when there is plenty of tickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const ticket = {
          approvedApplications: 42,
          quantity: 42,
        };
        const res = vm.ticketIsFull(ticket);
        // ACT & ASSERT
        expect(res).to.be.true;
      });
    });
    describe('ticketsAreFull', () => {
      it('should return false when there is plenty of tickets', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const tickets = [
          {
            approvedApplications: 1,
            quantity: 1,
          },
          {
            approvedApplications: 0,
            quantity: 1,
          },
        ];
        const res = vm.ticketsAreFull(tickets);
        // ACT & ASSERT
        expect(res).to.be.false;
      });
      it('should return true when there is no tickets left', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const tickets = [
          {
            approvedApplications: 1,
            quantity: 1,
          },
          {
            approvedApplications: 1,
            quantity: 1,
          },
        ];
        const res = vm.ticketsAreFull(tickets);
        // ACT & ASSERT
        expect(res).to.be.true;
      });
    });
  });
});
