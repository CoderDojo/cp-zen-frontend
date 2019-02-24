import Vue from 'vue';

const ForumService = {
  user: {
    search: email => Vue.http.get(`${Vue.config.forumsUrlBase}/api/user/email/${email}`, { credentials: true }),
  },
};
export default ForumService;
