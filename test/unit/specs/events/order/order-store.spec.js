import OrderStore from '@/events/order/order-store';

describe('Order Store', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('mutations', () => {
    describe('mutations.setApplications', () => {
      it('should set the applications based on their id', () => {
        // ARRANGE
        const applications = [{ userId: 1, name: 'Jane Doe' }];

        // ACT
        OrderStore.commit('setApplications', { id: 'user1', applications });
        expect(OrderStore.state.applications).to.deep.equal({
          user1: applications,
        });
      });
    });
    describe('mutations.removeApplications', () => {
      it('should remove the applications based on their id', () => {
        // ARRANGE
        OrderStore.state.applications = { 1: [{ userId: 1, name: 'Jane Doe' }] };

        // ACT
        OrderStore.commit('removeApplications', 1);
        expect(OrderStore.state.applications).to.deep.equal({});
      });
    });
  });

  describe('getters', () => {
    describe('getters.applications', () => {
      it('should emit an "input" event with the entering of application details', () => {
        // ARRANGE
        OrderStore.state.applications = { 1: [{ name: 'Jane Doe' }], 2: [{ name: 'Babar' }] };

        // ASSERT
        expect(OrderStore.getters.applications).to.deep.equal([
          { name: 'Jane Doe' },
          { name: 'Babar' },
        ]);
      });
    });
  });
});
