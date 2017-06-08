import Vue from 'vue';

const UserService = {
  register(user, profile) {
    return Vue.http.post(`${Vue.config.apiBase}/users/register`, {
      profile,
      user,
    }).then(() => Vue.http.post(`${Vue.config.apiBase}/users/login`, {
      email: user.email,
      password: user.password,
    }));
  },
};

export default UserService;
