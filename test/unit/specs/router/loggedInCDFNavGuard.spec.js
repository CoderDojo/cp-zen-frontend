import loggedInNavGuard from 'inject-loader!@/router/loggedInCDFNavGuard';

describe('loggedInCDFNavGuard', () => {
  let sandbox;
  let MockUserService;
  let loggedInNavGuardWithMock;
  let nextMock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockUserService = {
      getCurrentCDFUser: sandbox.stub(),
    };
    nextMock = sandbox.stub();
    loggedInNavGuardWithMock = loggedInNavGuard({
      '@/users/service': MockUserService,
    }).default;
  });

  it('should continue to the route if the user is logged in', async () => {
    // ARRANGE
    MockUserService.getCurrentCDFUser.resolves({ body: { login: { token: 'blah' } } });

    // ACT
    await loggedInNavGuardWithMock({}, {}, nextMock);

    // ASSERT
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWith();
  });

  it('should redirect to login with a referer query param of the route if user is not logged in', async () => {
    // ARRANGE
    const loggedInNavGuardInstance = loggedInNavGuard({
      '@/users/service': MockUserService,
    });
    const redirectStub = sandbox.stub(loggedInNavGuardInstance.fn, 'redirect');
    MockUserService.getCurrentCDFUser.resolves({ body: { login: null } });
    const toMock = {
      fullPath: '/some/path',
    };
    // ACT
    await loggedInNavGuardInstance.default(toMock, {}, nextMock);

    // ASSERT
    expect(nextMock).to.not.have.been.called;
    expect(redirectStub).to.have.been.calledOnce;
    // Can't stub window.location.replace, so... that's it.
  });
});
