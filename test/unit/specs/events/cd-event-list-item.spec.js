import vueUnitHelper from 'vue-unit-helper';
import EventListItem from '@/events/cd-event-list-item';

describe('Event list item component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('canBook', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(EventListItem);
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

    describe('isVisible', () => {
      let vm;

      beforeEach(() => {
        vm = vueUnitHelper(EventListItem);
        vm.event = {
          public: null,
        };
      });

      it('should return true if the user is a member of the dojo', () => {
        // ARRANGE
        vm.isMember = true;
        vm.event.public = false;

        // ACT & ASSERT
        expect(vm.isVisible).to.equal(true);
        vm.event.public = true;
        expect(vm.isVisible).to.equal(true);
      });

      it('should return true if the user is not a member of the dojo and the event is public', () => {
        // ARRANGE
        vm.isMember = false;
        vm.event.public = true;
        vm.usersDojos = [];

        // ACT & ASSERT
        expect(vm.isVisible).to.equal(true);
      });

      it('should return false if the user is not a member of the dojo and the event is private', () => {
        // ARRANGE
        vm.isMember = false;
        vm.event.public = false;
        vm.usersDojos = [];

        // ACT & ASSERT
        expect(vm.isVisible).to.equal(false);
      });
    });

    describe('isFull', () => {
      it('should return true for an event which is full and false for one which is not full', () => {
        const vm = vueUnitHelper(EventListItem);
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

        expect(vm.isFull).to.equal(true);

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
        expect(vm.isFull).to.equal(false);
      });
    });

    describe('getSessionListForEvent', () => {
      it('should return a list of session names for given event', () => {
        const vm = vueUnitHelper(EventListItem);
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
    describe('isPastEvent', () => {
      it('should return true for a one-off event whose date is before now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
          dates: [
            {
              startTime: '2017-06-10T16:30:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(true);
      });
      it('should return true for a recurring event whose last date is before now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
          type: 'recurring',
          dates: [
            {
              startTime: '2017-06-10T16:30:00.000Z',
            },
            {
              startTime: '2017-06-17T16:30:00.000Z',
            },
            {
              startTime: '2017-06-24T16:30:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(true);
      });
      it('should return false for a one-off event whose date is after now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const now = moment();
        const startTime = now.add(1, 'day');
        vm.event = {
          dates: [
            {
              startTime,
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(false);
      });
      it('should return false for a recurring event whose last date is after now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const now = moment();
        const startTime = now.add(1, 'day');

        vm.event = {
          type: 'recurring',
          dates: [
            {
              startTime: '2017-06-17T16:30:00.000Z',
            },
            {
              startTime: '2017-06-24T16:30:00.000Z',
            },
            {
              startTime,
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(false);
      });
    });
  });
});
