import Vue from 'vue';
import UserService from '@/users/service';

describe('UserService', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it('should register an account', () => {
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

    sandbox.stub(Vue.http, 'post');
    UserService.register(user, profile);

    expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiBase}/users/register`,
      { profile, user });
  });
});
