import Vue from 'vue';
import UserService from 'inject-loader!@/users/service';

describe('UserService', () => {
  let storeMock;
  let UserServiceWithMocks;

  beforeEach(() => {
    storeMock = {
      dispatch: sinon.stub(),
    };
    UserServiceWithMocks = UserService({
      '@/store': storeMock,
    }).default;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login()', () => {
    it('should login with the given email address and password', async () => {
      // ARRANGE
      window.cdMenu = {
        fns: {
          loadProfileMenu: sinon.stub(),
        },
      };
      const email = 'email';
      const password = 'password';
      sinon.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/login`, {
        email,
        password,
      }).returns(Promise.resolve('foo'));

      // ACT
      const resp = await UserServiceWithMocks.login(email, password);

      // ASSERT
      expect(resp).to.equal('foo');
      expect(window.cdMenu.fns.loadProfileMenu).to.have.been.calledOnce;
    });
  });

  describe('register()', () => {
    it('should register an account', async () => {
      // ARRANGE
      const profile = {
        id: 'bar',
      };

      const user = {
        id: 'foo',
      };

      sinon.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/register`, {
        profile,
        user,
      }).returns(Promise.resolve({ body: { user, profile, ok: true } }));
      sinon.stub(UserServiceWithMocks, 'login').returns(Promise.resolve());

      // ACT
      await UserServiceWithMocks.register(user, profile);
      expect(UserServiceWithMocks.login).to.have.been.calledOnce;
      expect(UserServiceWithMocks.login).to.have.been.calledWith(user.email, user.password);
    });
  });

  describe('userProfileData', () => {
    it('should return a promise that resolves with the current user\'s profile', (done) => {
      // ARRANGE
      const responseMock = {
        dob: '2000-10-26T00:00:00.000Z',
      };
      sinon.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/profiles/user-profile-data`, { query: { userId: 'parent1' } }).returns(Promise.resolve(responseMock));

      // ACT
      UserServiceWithMocks.userProfileData('parent1').then((resp) => {
        // ASSERT
        expect(resp).to.deep.equal(responseMock);
        done();
      });
    });
  });

  describe('updateUserProfileData()', () => {
    it('should update the current users profile with the given profile', async () => {
      // ARRANGE
      const profile = {
        id: 'foo',
      };

      sinon.stub(Vue.http, 'post').returns(Promise.resolve());

      // ACT
      await UserServiceWithMocks.updateUserProfileData(profile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/create`, { profile });
    });
  });

  describe('getCurrentUser()', () => {
    it('should return a promise that resolves with the currently logged in user', (done) => {
      // ARRANGE
      const userMock = {
        key: 'val',
      };
      sinon.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/users/instance`)
        .returns(Promise.resolve({ body: userMock }));

      // ACT
      UserServiceWithMocks.getCurrentUser().then((user) => {
        // ASSERT
        expect(user.body).to.deep.equal(userMock);
        done();
      });
    });
  });

  describe('addChild()', () => {
    it('should add the given child profile to the current user', async () => {
      // ARRANGE
      const profile = {
        id: 'foo',
      };

      sinon.stub(Vue.http, 'post').returns(Promise.resolve());

      // ACT
      await UserServiceWithMocks.addChild(profile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, { profile });
    });
  });
});
