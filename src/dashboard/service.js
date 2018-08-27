import Vue from 'vue';

const NewsForumsService = {
  // load recent forums
  loadForums() {
    return Vue.http.get(`${Vue.config.forumsUrlBase}/api/recent/new`);
  },
  // load news
  loadNews() {
    return Vue.http.get(`${Vue.config.newsUrlBase}/wp-json/wp/v2/posts`);
  },
};

export default NewsForumsService;
