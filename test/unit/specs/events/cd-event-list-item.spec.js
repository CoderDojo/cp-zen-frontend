import vueUnitHelper from 'vue-unit-helper';
import eventListItem from '!!vue-loader?inject!@/events/cd-event-list-item';

describe('Event list item component', () => {
  let sandbox;
  let EventListItemWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    EventListItemWithMocks = eventListItem();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('canBook', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(eventListItem());
      });

      it('should be false if this.user is falsey and dojo is private', () => {
        // ARRANGE
        vm.user = null;
        vm.dojo = {
          private: 1,
        };
        vm.usersDojos = [];

        // ASSERT
        expect(vm.canBook).to.equal(false);
      });

      it('should be true if this.user is truthy and they are a member of the dojo, but dojo is private', () => {
        // ARRANGE
        vm.user = {
          id: 'foo',
        };
        vm.isMember = true;
        vm.dojo = {
          private: 1,
        };

        // ASSERT
        expect(vm.canBook).to.equal(true);
      });

      it('should be true if this.user is falsey and dojo is public', () => {
        // ARRANGE
        vm.user = null;
        vm.dojo = {
          private: 0,
        };
        vm.usersDojos = [];

        // ASSERT
        expect(vm.canBook).to.equal(true);
      });

      it('should be true if this.user is truthy and dojo is public', () => {
        // ARRANGE
        vm.user = {
          id: 'foo',
        };
        vm.dojo = {
          private: 0,
        };
        vm.usersDojos = [];

        // ASSERT
        expect(vm.canBook).to.equal(true);
      });

      it('should be false if this.user is true and they are not a member of the dojo, but the dojo is private', () => {
        // ARRANGE
        vm.user = {
          id: 'foo',
        };
        vm.usersDojos = [];
        vm.dojo = {
          private: 1,
        };

        // ASSERT
        expect(vm.canBook).to.equal(false);
      });
    });

    describe('isEventShown', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(EventListItemWithMocks);
        vm.event = {
          public: null,
        };
      });

      it('should return true if the user is a member of the dojo', () => {
        // ARRANGE
        vm.isMember = true;
        vm.event.public = false;

        // ACT & ASSERT
        expect(vm.isEventShown).to.equal(true);
        vm.event.public = true;
        expect(vm.isEventShown).to.equal(true);
      });

      it('should return true if the user is not a member of the dojo and the event is public', () => {
        // ARRANGE
        vm.isMember = false;
        vm.event.public = true;
        vm.usersDojos = [];

        // ACT & ASSERT
        expect(vm.isEventShown).to.equal(true);
      });

      it('should return false if the user is not a member of the dojo and the event is private', () => {
        // ARRANGE
        vm.isMember = false;
        vm.event.public = false;
        vm.usersDojos = [];

        // ACT & ASSERT
        expect(vm.isEventShown).to.equal(false);
      });
    });

    describe('isEventFull', () => {
      it('should return true for an event which is full and false for one which is not full', () => {
        const vm = vueUnitHelper(eventListItem());
        vm.event = {
          id: 1,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 3,
                },
                {
                  quantity: 4,
                  approvedApplications: 4,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 2,
                },
                {
                  quantity: 5,
                  approvedApplications: 5,
                },
              ],
            },
          ],
        };

        expect(vm.isEventFull).to.equal(true);

        vm.event = {
          id: 2,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 2,
                },
                {
                  quantity: 4,
                  approvedApplications: 3,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 1,
                },
                {
                  quantity: 5,
                  approvedApplications: 4,
                },
              ],
            },
          ],
        };

        expect(vm.isEventFull).to.equal(false);
      });
    });

    describe('getSessionListForEvent', () => {
      it('should return a list of session names for given event', () => {
        const vm = vueUnitHelper(eventListItem());
        vm.event = {
          sessions: [
            { name: 'Scratch' },
            { name: 'Arduino' },
            { name: 'HTML' },
          ],
        };

        expect(vm.getSessionListForEvent).to.equal('Scratch, Arduino, HTML');
      });
    });
  });
});
