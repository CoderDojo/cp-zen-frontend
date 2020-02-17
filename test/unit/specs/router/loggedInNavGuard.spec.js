import loggedInNavGuard from 'inject-loader!@/router/loggedInNavGuard';

describe('loggedInNavGuard', () => {
  let MockUserService;
  let loggedInNavGuardWithMock;
  let nextMock;

  beforeEach(() => {
    MockUserService = {
      getCurrentUser: sinon.stub(),
    };
    nextMock = sinon.stub();
    loggedInNavGuardWithMock = loggedInNavGuard({
      '@/users/service': MockUserService,
    }).default;
  });

  it('should continue to the route if the user is logged in', async () => {
    // ARRANGE
    MockUserService.getCurrentUser.resolves({
      body: {
        login: { token: 'blah' },
        user: { termsConditionsAccepted: true },
      },
    });

    // ACT
    await loggedInNavGuardWithMock({}, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith(undefined);
  });

  it('should redirect to login with a referer query param of the route if user is not logged in', async () => {
    // ARRANGE
    MockUserService.getCurrentUser.resolves({ body: { login: null } });
    const toMock = {
      fullPath: '/some/path',
    };

    // ACT
    await loggedInNavGuardWithMock(toMock, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith({
      name: 'Login',
      query: { referer: '/some/path' },
    });
  });

  it('should redirect to profile page if user has not accepted terms and conditions', async () => {
    // ARRANGE
    MockUserService.getCurrentUser.resolves({
      body: {
        login: { token: 'blah' },
        user: { id: 'userid', termsConditionsAccepted: false },
      },
    });
    const toMock = {
      fullPath: '/some/path',
    };

    // ACT
    await loggedInNavGuardWithMock(toMock, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith({
      path: '/dashboard/profile/userid/edit',
    });
  });
});
