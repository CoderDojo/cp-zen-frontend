import Vue from 'vue';
import Cookie from 'js-cookie';

const LocaleService = {
  getStrings: lang => Vue.http.get(`${Vue.config.apiServer}/locale/data?format=mf&lang=${lang}`),
  getUserLocale: () => Cookie.get('NG_TRANSLATE_LANG_KEY'),
};

export default LocaleService;
