import Vue from 'vue';

const UserService = {
  async login(email, password) {
    const loginResp = await Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/login`, {
      email,
      password,
    });
    window.cdMenu.fns.loadProfileMenu();
    return loginResp;
  },

  async register(user, profile) {
    await Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/register`, {
      profile,
      user,
    });
    return UserService.login(user.email, user.password);
  },

  userProfileData: userId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/user-profile-data`, { query: { userId } }),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/instance`),

  getChildren: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/profiles/children-for-user/${userId}`),

  addChild: profile => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, { profile }),
};

export default UserService;
