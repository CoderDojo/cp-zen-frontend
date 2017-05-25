import Vue from 'vue';
import Router from 'vue-router';
import FindDojo from '@/dojos/cd-find-dojo';
import DojoList from '@/dojos/cd-dojo-list';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/v2',
  routes: [
    {
      path: '/',
      name: 'FindDojo',
      component: FindDojo,
    },
    {
      path: '/dojos',
      name: 'DojoList',
      component: DojoList,
    },
  ],
});
