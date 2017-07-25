import Vue from 'vue';
import { extend, clone } from 'lodash';
import UserService from '@/users/service';
import UserUtils from '@/users/util';

describe('UserService', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
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

      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/register`, {
        profile,
        user,
      }).returns(Promise.resolve());
      sandbox.stub(UserService, 'login').returns(Promise.resolve());

      // ACT
      await UserService.register(user, profile);

      // ASSERT
      expect(UserService.login).to.have.been.calledOnce;
      expect(UserService.login).to.have.been.calledWith(user.email, user.password);
    });
  });

  describe('login()', () => {
    it('should login with the given email address and password', async () => {
      // ARRANGE
      const email = 'email';
      const password = 'password';
      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/login`, {
        email,
        password,
      }).returns(Promise.resolve('foo'));

      // ACT
      const resp = await UserService.login(email, password);

      // ASSERT
      expect(resp).to.equal('foo');
    });
  });

  describe('getCurrentUser()', () => {
    it('should return a promise that resolves with the currently logged in user', async () => {
      // ARRANGE
      const userMock = {
        key: 'val',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/users/instance`)
        .returns(Promise.resolve({ body: userMock }));

      // ACT
      const user = await UserService.getCurrentUser();

      // ASSERT
      expect(user.body).to.deep.equal(userMock);
    });
  });

  describe('addChild()', () => {
    it('should add the given u13 child profile to the current user', async () => {
      // ARRANGE
      const mockProfile = {
        gender: 'foo',
        dob: new Date(2008, 9, 10, 0, 0, 0, 0),
      };

      const expectedPayload = {
        profile: extend(clone(mockProfile), {
          userTypes: ['attendee-u13'],
          dob: '2008-10-10T00:00:00.000Z',
        }),
      };

      sandbox.stub(Vue.http, 'post').returns(Promise.resolve());
      sandbox.stub(UserUtils, 'isUnderAge').withArgs(mockProfile.dob).returns(true);

      // ACT
      await UserService.addChild(mockProfile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
    });

    it('should add the given o13 child profile to the current user', async () => {
      // ARRANGE
      const mockProfile = {
        gender: 'foo',
        dob: new Date(2008, 9, 10, 0, 0, 0, 0),
      };

      const expectedPayload = {
        profile: extend(clone(mockProfile), {
          userTypes: ['attendee-o13'],
          dob: '2008-10-10T00:00:00.000Z',
        }),
      };

      sandbox.stub(Vue.http, 'post').returns(Promise.resolve());
      sandbox.stub(UserUtils, 'isUnderAge').withArgs(mockProfile.dob).returns(false);

      // ACT
      await UserService.addChild(mockProfile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
    });

    it('should use otherGender if gender is "Other"', async () => {
      // ARRANGE
      const mockProfile = {
        gender: 'Other',
        otherGender: 'Fluid',
        dob: new Date(2008, 9, 10, 0, 0, 0, 0),
      };

      const expectedPayload = {
        profile: {
          userTypes: ['attendee-o13'],
          dob: '2008-10-10T00:00:00.000Z',
          gender: 'Fluid',
        },
      };

      sandbox.stub(Vue.http, 'post').returns(Promise.resolve());
      sandbox.stub(UserUtils, 'isUnderAge').withArgs(mockProfile.dob).returns(false);

      // ACT
      await UserService.addChild(mockProfile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
    });
  });
});
