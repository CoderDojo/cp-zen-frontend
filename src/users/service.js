import Vue from 'vue';

const UserService = {
  search: query => Vue.http.get(`${Vue.config.apiServer}/api/3.0/users`, { params: query }),

  load: (userId, query) => Vue.http.get(`${Vue.config.apiServer}/api/3.0/users/${userId}`, { params: query }),

  delete: (userId, body) => Vue.http.delete(`${Vue.config.apiServer}/api/3.0/users/${userId}`, { body }),

  userProfileData: userId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/user-profile-data`, { query: { userId } }),

  updateUserProfileData: profile => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/create`, { profile }),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/instance`),

  getCurrentCDFUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/cdf/instance`),

  getChildren: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/profiles/children-for-user/${userId}`),

  addChild: profile => Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, { profile }),
};

export default UserService;
