import loggedInNavGuard from 'inject-loader!@/router/loggedInNavGuard';

describe('loggedInNavGuard', () => {
  let sandbox;
  let MockUserService;
  let loggedInNavGuardWithMock;
  let nextMock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockUserService = {
      getCurrentUser: sandbox.stub(),
    };
    nextMock = sandbox.stub();
    loggedInNavGuardWithMock = loggedInNavGuard({
      '@/users/service': MockUserService,
    }).default;
  });

  it('should continue to the route if the user is logged in', async () => {
    // ARRANGE
    MockUserService.getCurrentUser.resolves({ body: { login: { token: 'blah' } } });

    // ACT
    await loggedInNavGuardWithMock({}, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith(true);
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
});
