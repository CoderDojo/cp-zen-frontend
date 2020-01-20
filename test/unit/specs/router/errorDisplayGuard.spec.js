import errorDisplayGuard from 'inject-loader!@/router/errorDisplayGuard';

describe('errorDisplayGuard', () => {
  let MockVue;
  let errorDisplayGuardWithMock;
  let nextMock;

  beforeEach(() => {
    MockVue = {
      toasted: { show: sinon.stub() },
    };
    nextMock = sinon.stub();
    errorDisplayGuardWithMock = errorDisplayGuard({
      vue: MockVue,
    }).default;
  });

  describe('with no error query param', () => {
    it('should continue if no error query param', async () => {
      // ACT
      await errorDisplayGuardWithMock({ query: {} }, {}, nextMock);

      // ASSERT
      expect(nextMock).to.have.been.calledOnce;
      expect(nextMock).to.have.been.calledWith();
      expect(MockVue.toasted.show).not.to.have.been.called;
    });
  });

  describe('with error query param', () => {
    // ARRANGE
    const mockTo = {
      path: '/mockPath',
      query: {
        otherQuery: 'mockValue',
        error: 'Mock Error Message',
      },
    };
    it('should call toast show with error query param', async () => {
      // ACT
      await errorDisplayGuardWithMock(mockTo, {}, nextMock);

      // ASSERT
      expect(MockVue.toasted.show).to.have.been.calledWith(mockTo.query.error);
    });
    it('should call next with same to object but with the query excluding error', async () => {
      // ACT
      await errorDisplayGuardWithMock(mockTo, {}, nextMock);

      // ASSERT
      expect(nextMock).to.have.been.calledOnce;
      const calledTo = nextMock.firstCall.args[0];
      expect(calledTo.path).to.equal(mockTo.path);
      expect(calledTo.query).to.have.property('otherQuery', mockTo.query.otherQuery);
      expect(calledTo.query).not.to.have.property('error');
    });
  });
});
