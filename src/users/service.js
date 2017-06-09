import Vue from 'vue';

const UserService = {
  register: (user, profile) => Vue.http.post(`${Vue.config.apiBase}/users/register`, {
    profile,
    user,
  }).then(() => Vue.http.post(`${Vue.config.apiBase}/users/login`, {
    email: user.email,
    password: user.password,
  })),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiBase}/users/instance`),
};

export default UserService;
