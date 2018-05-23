import OrderStore from '@/events/order-store';

describe('Order Store', () => {
  let OrderStoreWithMocks;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('mutations', () => {
    describe('mutations.setApplications', () => {
      it('should set the application based on their id', () => {
        // ARRANGE
        const applications = [{ id: '1', name: 'Jane Doe' }];

        // ACT
        OrderStore.commit('setApplications', applications);

        // ASSERT
        //expect(Vue.set).to.have.been.calledWith(vm.state.applications, '1', applications);
      });
    });
  });

  describe('getters', () => {
    describe('getters.applications', () => {
      it('should emit an "input" event with the entering of application details', () => {
        // ARRANGE
        OrderStore.state.applications = { '1': [{ name: 'Jane Doe'}], '2': [{ name: 'Babar' }]};

        // ASSERT
        expect(OrderStore.getters.applications).to.deep.equal([
          { name: 'Jane Doe' },
          { name: 'Babar' },
        ]);
      });
    });
  });
});
