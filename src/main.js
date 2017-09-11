// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueAnalytics from 'vue-analytics';
import PasswordValidator from '@/common/directives/cd-password-validator';
import 'font-awesome/css/font-awesome.min.css';
import 'vue-dob-picker/dist/static/vue-dob-picker.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import App from './App';
import router from './router';
import i18n from './i18n';

Vue.config.productionTip = false;
Vue.config.apiServer = process.env.API_SERVER;
Vue.config.buildBranch = process.env.GIT_BRANCH;
Vue.config.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: Vue.config.googleMapsApiKey,
  },
});
Vue.use(VueAnalytics, {
  id: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  router,
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
