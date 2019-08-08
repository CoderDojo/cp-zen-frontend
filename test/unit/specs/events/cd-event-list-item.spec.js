import vueUnitHelper from 'vue-unit-helper';
import EventListItem from '@/events/cd-event-list-item';

describe('Event list item component', () => {
  afterEach(() => {
    sinon.restore();
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
  });
});
