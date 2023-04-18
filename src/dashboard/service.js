import Vue from 'vue';

const UpdatesService = {
  // load recent forums
  loadForums() {
    return Vue.http.get(`${Vue.config.forumsUrlBase}/api/recent/new`);
  },
  // load news
  loadNews() {
    var params = JSON.stringify({query:"{posts (first: 6){nodes {title date uri}}}"});
    return Vue.http.post(`${Vue.config.cdWpGraphQlUrl}`, params);
  },
};

export default UpdatesService;
