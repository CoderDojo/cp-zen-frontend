import Vue from 'vue';

const UpdatesService = {
  // load recent forums
  loadForums() {
    return Vue.http.get(`${Vue.config.forumsUrlBase}/api/recent/new`);
  },
  // load news
  loadNews(params) {
    return Vue.http.get(`${Vue.config.newsUrlBase}/wp-json/wp/v2/posts`, { params });
  },
};

export default UpdatesService;
