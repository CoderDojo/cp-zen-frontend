// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import * as VueGoogleMaps from 'vue2-google-maps';
import PasswordValidator from '@/common/directives/cd-password-validator';
import 'font-awesome/css/font-awesome.min.css';
import 'vue-dob-picker/dist/static/vue-dob-picker.css';
import App from './App';
import router from './router';
import './dojos/filters';

Vue.config.productionTip = false;
Vue.config.apiServer = process.env.API_SERVER;

Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC3xF9XV91bS2R14Gjmx3UQaKbGgAfHbE4',
  },
});

Vue.config.lang = 'en_US';

const messages = {
  en_US: require('cp-translations/strings/en_US/messages.po'),
};

const i18n = new VueI18n({
  locale: 'en_US',
  messages,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  i18n,
});

VeeValidate.Validator.extend('cd-password', PasswordValidator);
