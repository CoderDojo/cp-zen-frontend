import Vue from 'vue';
import Router from 'vue-router';
import DojoDetails from '@/dojos/components/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';

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
      path: '/:lat/:long',
      name: 'FindDojoWithLatAndLong',
      component: FindDojo,
      props: true,
    },
    {
      path: '/dojos/:country/:region/:dojoName',
      name: 'DojoDetails',
      component: DojoDetails,
      props: true,
    },

  ],
});
