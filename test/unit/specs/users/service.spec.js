import Vue from 'vue';
import { extend, clone } from 'lodash';
import UserService from '@/users/service';
import UserUtils from '@/users/util';

describe('UserService', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  describe('login()', () => {
    it('should login with the given email address and password', (done) => {
      // ARRANGE
      const email = 'email';
      const password = 'password';
      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/login`, {
        email,
        password,
      }).returns(Promise.resolve('foo'));

      // ACT
      UserService.login(email, password).then((resp) => {
        // ASSERT
        expect(resp).to.equal('foo');
        done();
      });
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

      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/users/register`, {
        profile,
        user,
      }).returns(Promise.resolve());
      sandbox.stub(UserService, 'login').returns(Promise.resolve());

      // ACT
      await UserService.register(user, profile);
      expect(UserService.login).to.have.been.calledOnce;
      expect(UserService.login).to.have.been.calledWith(user.email, user.password);
    });

    it('should convert profile.dob into an ISO timestamp from a Date object', async () => {
      // ARRANGE
      const profile = {
        id: 'bar',
        dob: new Date(2017, 10, 10, 0, 0, 0, 0),
      };
      const transformedProfile = {
        id: 'bar',
        dob: '2017-11-10T00:00:00.000Z',
      };

      const user = {
        id: 'foo',
      };

      sandbox.stub(Vue.http, 'post');
      sandbox.stub(UserService, 'login').returns(Promise.resolve());

      // ACT
      await UserService.register(user, profile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(
        `${Vue.config.apiServer}/api/2.0/users/register`,
        {
          profile: transformedProfile,
          user,
        },
      );
    });

    it('should convert profile.dob into an ISO timestamp from a string object', async () => {
      // ARRANGE
      const profile = {
        id: 'bar',
        dob: 'Fri Nov 10 2017 00:00:00 GMT+0000 (GMT)',
      };
      const transformedProfile = {
        id: 'bar',
        dob: '2017-11-10T00:00:00.000Z',
      };

      const user = {
        id: 'foo',
      };

      sandbox.stub(Vue.http, 'post');
      sandbox.stub(UserService, 'login').returns(Promise.resolve());

      // ACT
      await UserService.register(user, profile);

      // ASSERT
      expect(Vue.http.post).to.have.been.calledWith(
        `${Vue.config.apiServer}/api/2.0/users/register`,
        {
          profile: transformedProfile,
          user,
        },
      );
    });
  });

  describe('userProfileData', () => {
    it('should return a promise that resolves with the current user\'s profile', (done) => {
      // ARRANGE
      const responseMock = {
        dob: '2000-10-26T00:00:00.000Z',
      };
      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/profiles/user-profile-data`, { query: { userId: 'parent1' } }).returns(Promise.resolve(responseMock));

      // ACT
      UserService.userProfileData('parent1').then((resp) => {
        // ASSERT
        expect(resp).to.deep.equal(responseMock);
        done();
      });
    });
  });

  describe('getCurrentUser()', () => {
    it('should return a promise that resolves with the currently logged in user', (done) => {
      // ARRANGE
      const userMock = {
        key: 'val',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/users/instance`)
        .returns(Promise.resolve({ body: userMock }));

      // ACT
      UserService.getCurrentUser().then((user) => {
        // ASSERT
        expect(user.body).to.deep.equal(userMock);
        done();
      });
    });
  });

  describe('addChild()', () => {
    it('should add the given u13 child profile to the current user', (done) => {
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
      UserService.addChild(mockProfile).then(() => {
        // ASSERT
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
        done();
      });
    });

    it('should add the given o13 child profile to the current user', (done) => {
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
      UserService.addChild(mockProfile).then(() => {
        // ASSERT
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
        done();
      });
    });

    it('should use otherGender if gender is "Other"', (done) => {
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
      UserService.addChild(mockProfile).then(() => {
        // ASSERT
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, expectedPayload);
        done();
      });
    });
  });
});
