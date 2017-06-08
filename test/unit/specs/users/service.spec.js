import Vue from 'vue';
import UserService from '@/users/service';

describe('UserService', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

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
