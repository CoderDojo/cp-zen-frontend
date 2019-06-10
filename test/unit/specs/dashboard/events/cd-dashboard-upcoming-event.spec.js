import vueUnitHelper from 'vue-unit-helper';
import DashboardUpcomingEventComponent from '!!vue-loader?inject!@/dashboard/events/cd-dashboard-upcoming-event';

describe('Dashboard upcoming event component', () => {
  let vm;
  let MockEventsService;

  beforeEach(() => {
    MockEventsService = {
      v3: {
        getOrder: sinon.stub(),
      },
    };
    vm = vueUnitHelper(DashboardUpcomingEventComponent({
      '@/events/service': MockEventsService,
    }));
  });

  afterEach(() => {
    sinon.restore();
  });


  describe('computed', () => {
    describe('bookedNinjaTickets', () => {
      it('should return the total booked ninja tickets for the current user', () => {
        // ARRANGE
        vm.orders = [{
          applications: [
            { ticketType: 'ninja' },
            { ticketType: 'parent-guardian' },
            { ticketType: 'ninja' },
          ],
        }];

        // ASSERT
        expect(vm.bookedNinjaTickets).to.equal(2);
      });
    });
    describe('bookedMentorTickets', () => {
      it('should return the total booked mentor tickets for the current user', () => {
        // ARRANGE
        vm.orders = [{
          applications: [
            { ticketType: 'ninja' },
            { ticketType: 'mentor' },
            { ticketType: 'ninja' },
          ],
        }];

        // ASSERT
        expect(vm.bookedMentorTickets).to.equal(1);
      });
    });
    describe('isChampion', () => {
      it('should return true if the user has a usersdojo with a userType of champion', () => {
        // ARRANGE
        vm.event = {
          usersDojos: [
            { userTypes: ['champion'] },
          ],
        };

        // ASSERT
        expect(vm.isChampion).to.equal(true);
      });

      it('should return false if the user does not have a usersdojo with a userType of champion', () => {
        // ARRANGE
        vm.event = {
          usersDojos: [
            { userTypes: ['mentor'] },
          ],
        };

        // ASSERT
        expect(vm.isChampion).to.equal(false);
      });
    });

    describe('isTicketingAdmin', () => {
      it('should return true if the user has a usersdojo with a permission of ticketing-admin', () => {
        it('should return true if the user has a usersdojo with a userType of champion', () => {
          // ARRANGE
          vm.event = {
            usersDojos: [
              {
                userPermissions: [{ name: 'ticketing-admin' }],
              },
            ],
          };

          // ASSERT
          expect(vm.isTicketingAdmin).to.equal(true);
        });
      });

      it('should return false if the user does not have a usersdojo with a permission of ticketing-admin', () => {
        // ARRANGE
        vm.event = {
          usersDojos: [
            {
              userPermissions: [],
            },
          ],
        };

        // ASSERT
        expect(vm.isTicketingAdmin).to.equal(false);
      });
    });
  });

  describe('methods', () => {
    describe('ticketReduction', () => {
      it('should add up all the values for the given field for all tickets of the given type', () => {
        // ARRANGE
        vm.event = {
          sessions: [
            {
              tickets: [
                { type: 'ninja', approvedApplications: 4, quantity: 10 },
                { type: 'mentor', approvedApplications: 2, quantity: 5 },
              ],
            },
            {
              tickets: [
                { type: 'ninja', approvedApplications: 10, quantity: 15 },
                { type: 'mentor', approvedApplications: 4, quantity: 5 },
              ],
            },
          ],
        };

        // ASSERT
        expect(vm.ticketReduction('ninja', 'approvedApplications')).to.equal(14);
        expect(vm.ticketReduction('ninja', 'quantity')).to.equal(25);
        expect(vm.ticketReduction('mentor', 'approvedApplications')).to.equal(6);
        expect(vm.ticketReduction('mentor', 'quantity')).to.equal(10);
      });
    });
    describe('loadOrders', () => {
      it('should fetch orders for the logged in user for the given event', async () => {
        // ARRANGE
        vm.loggedInUser = { id: 'foo' };
        vm.event = { id: 'bar' };
        MockEventsService.v3.getOrder
          .withArgs('foo', { params: { query: { eventId: 'bar' } } })
          .resolves({ body: { results: [{ id: 'baz' }] } });

        // ACT
        await vm.loadOrders();

        // ASSERT
        expect(vm.orders).to.deep.equal([{ id: 'baz' }]);
      });
    });
  });
});
