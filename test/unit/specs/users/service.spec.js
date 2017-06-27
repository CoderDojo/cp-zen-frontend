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
    it('should register an account', (done) => {
      const profile = {};

      const user = {
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'foo.bar@baz.com',
        initUserType: {
          title: 'Parent/Guardian',
          name: 'parent-guardian',
        },
        password: 'Passw0rd',
        termsConditionsAccepted: true,
        'g-recaptcha-response': 'abc123',
      };

      sandbox.stub(Vue.http, 'post').returns(Promise.resolve());
      UserService.register(user, profile).then(() => {
        expect(Vue.http.post.firstCall.args[0]).to.equal(`${Vue.config.apiBase}/users/register`);
        expect(Vue.http.post.firstCall.args[1]).to.deep.equal({ profile, user });

        expect(Vue.http.post.secondCall.args[0]).to.equal(`${Vue.config.apiBase}/users/login`);
        expect(Vue.http.post.secondCall.args[1])
          .to.deep.equal({ email: user.email, password: user.password });
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
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiBase}/users/instance`)
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
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiBase}/profiles/youth/create`, expectedPayload);
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
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiBase}/profiles/youth/create`, expectedPayload);
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
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiBase}/profiles/youth/create`, expectedPayload);
        done();
      });
    });
  });
});
