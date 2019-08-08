import ticketingAdminNavGuard from 'inject-loader!@/router/ticketingAdminNavGuard';

describe('ticketingAdminNavGuard', () => {
  let MockUserService;
  let ticketingAdminNavGuardWithMock;
  let nextMock;
  let MockUsersDojosService;
  let MockUsersDojosUtil;

  beforeEach(() => {
    MockUserService = {
      getCurrentUser: sinon.stub(),
    };
    MockUsersDojosService = {
      getUsersDojos: sinon.stub(),
    };
    MockUsersDojosUtil = {
      hasPermission: sinon.stub(),
    };

    nextMock = sinon.stub();
    ticketingAdminNavGuardWithMock = ticketingAdminNavGuard({
      '@/users/service': MockUserService,
      '@/usersDojos/service': MockUsersDojosService,
      '@/usersDojos/util': MockUsersDojosUtil,
    }).default;
  });

  it('continues to the route if the user is a cdf-admin', async () => {
    MockUserService.getCurrentUser.resolves({ body: { user: { roles: ['cdf-admin'] } } });
    const toMock = {
      fullPath: '/some/path',
    };
    await ticketingAdminNavGuardWithMock(toMock, {}, nextMock);
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWithExactly();
  });

  it('continues to the route if the user is a dojo admin for current dojo', async () => {
    MockUserService.getCurrentUser.resolves({ body: { user: { roles: [] } } });
    MockUsersDojosService.getUsersDojos.resolves({
      body: [{}],
    });
    MockUsersDojosUtil.hasPermission.returns({ id: 'something' });
    const toMock = {
      fullPath: '/some/path',
      params: { dojoId: 'd1' },
    };
    await ticketingAdminNavGuardWithMock(toMock, {}, nextMock);
    expect(MockUsersDojosUtil.hasPermission).to.have.been.calledOnce
      .and.calledWith([{}], 'dojo-admin');
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWithExactly();
  });

  it('continues to the route if the user is a ticketing admin for current dojo', async () => {
    MockUserService.getCurrentUser.resolves({ body: { user: { roles: [] } } });
    MockUsersDojosService.getUsersDojos.resolves({
      body: [{}],
    });
    MockUsersDojosUtil.hasPermission.withArgs([{}], 'dojo-admin').returns(undefined);
    MockUsersDojosUtil.hasPermission.withArgs([{}], 'ticketing-admin').returns({ id: 'something' });
    const toMock = {
      fullPath: '/some/path',
      params: { dojoId: 'd1' },
    };
    await ticketingAdminNavGuardWithMock(toMock, {}, nextMock);
    expect(MockUsersDojosUtil.hasPermission).to.have.been.calledWith([{}], 'ticketing-admin');
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWithExactly();
  });

  it('continues to the home page if the user does not have correct permissions', async () => {
    MockUserService.getCurrentUser.resolves({ body: { user: { roles: [] } } });
    MockUsersDojosService.getUsersDojos.resolves({
      body: [{}],
    });
    MockUsersDojosUtil.hasPermission.returns(undefined);
    const toMock = {
      fullPath: '/some/path',
      params: { dojoId: 'd1' },
    };
    await ticketingAdminNavGuardWithMock(toMock, {}, nextMock);
    expect(nextMock).to.have.been.calledOnce;
    expect(nextMock).to.have.been.calledWithExactly({ name: 'Home' });
  });
});
