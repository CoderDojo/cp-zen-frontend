// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import PasswordValidator from '@/common/directives/cd-password-validator';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import router from './router';
import './dojos/filters';

Vue.config.productionTip = false;
Vue.config.apiBase = process.env.API_BASE;

Vue.use(VueResource);
Vue.use(VeeValidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});

VeeValidate.Validator.extend('cd-password', PasswordValidator);
