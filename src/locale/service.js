import Vue from 'vue';

const LocaleService = {
  getStrings: lang => Vue.http.get(`${Vue.config.apiServer}/locale/data?format=mf&lang=${lang}`),
};

export default LocaleService;
