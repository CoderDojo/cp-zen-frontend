import orderExistsNavGuard from 'inject-loader!@/router/orderExistsNavGuard';

describe('orderExistsNavGuard', () => {
  let MockEventService;
  let store;
  let orderExistsNavGuardWithMock;
  let nextMock;

  beforeEach(() => {
    MockEventService = {
      v3: {
        getOrder: sinon.stub(),
      },
    };
    store = {
      getters: {
        loggedInUser: {},
      },
    };
    nextMock = sinon.stub();
    orderExistsNavGuardWithMock = orderExistsNavGuard({
      '@/events/service': MockEventService,
      '@/store': store,
    }).default;
  });

  it('should continue to the route if the order exists', async () => {
    // ARRANGE
    MockEventService.v3.getOrder.resolves({ body: { results: [{}] } });
    const toMock = {
      params: {
        eventId: 'event1',
      },
    };

    // ACT
    await orderExistsNavGuardWithMock(toMock, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith(true);
  });

  it('should redirect to the session page if the order doesn\'t exists', async () => {
    // ARRANGE
    MockEventService.v3.getOrder.resolves({ body: { results: [] } });
    const toMock = {
      params: {
        eventId: 'event1',
      },
    };
    // ACT
    await orderExistsNavGuardWithMock(toMock, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith({
      name: 'EventSessions',
      params: {
        eventId: 'event1',
      },
    });
  });
});
