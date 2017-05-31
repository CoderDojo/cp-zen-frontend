import Vue from 'vue';

const UserService = {
  register(user, profile) {
    return Vue.http.post(`${Vue.config.apiBase}/users/register`, {
      profile,
      user,
    });
  },
};

export default UserService;
