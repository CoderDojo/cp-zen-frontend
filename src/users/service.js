import Vue from 'vue';
import store from '@/store';

const UserService = {
  async login(email, password) {
    const loginResp = await Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/login`, {
      email,
      password,
    });
    window.cdMenu.fns.loadProfileMenu();
    await store.dispatch('getLoggedInUser');
    return loginResp;
  },

  async register(user, profile) {
    const res = await Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/register`, {
      profile,
      user,
    });
    if (res.body.error || !res.body.ok) {
      throw new Error(res.body.error || res.body.why);
    }
    return UserService.login(user.email, user.password);
  },

  search: query => Vue.http.get(`${Vue.config.apiServer}/api/3.0/users`, { params: query }),

  load: userId => Vue.http.get(`${Vue.config.apiServer}/api/3.0/users/${userId}`),

  delete: (userId, soft) => Vue.http.delete(`${Vue.config.apiServer}/api/3.0/users/${userId}`, { body: { soft } }),

  userProfileData: userId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/user-profile-data`, { query: { userId } }),

  updateUserProfileData: profile => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/create`, { profile }),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/instance`),

  getCurrentCDFUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/cdf/instance`),

  getChildren: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/profiles/children-for-user/${userId}`),

  addChild: profile => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, { profile }),
};

export default UserService;
