import Vue from 'vue';
import Router from 'vue-router';
import DojoDetails from '@/dojos/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';
import UserTickets from '@/users/cd-tickets';
import EventDetails from '@/events/order/cd-event-details';
import LoginOrRegister from '@/users/cd-login-or-register';
import EventSessions from '@/events/order/cd-event-sessions';
import BookingConfirmation from '@/events/order/cd-booking-confirmation';
import Login from '@/users/cd-login';
import orderWrapper from '@/events/order/wrapper';
import loggedInNavGuard from './loggedInNavGuard';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash,
      };
    }
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'FindDojo',
      component: FindDojo,
    },
    {
      path: '/dojos/:country([A-Za-z]{2})/:path+',
      name: 'DojoDetails',
      component: DojoDetails,
      props: true,
    },
    {
      path: '/dojos/:id',
      name: 'DojoDetailsId',
      component: DojoDetails,
      props: true,
    },
    {
      path: '/dashboard/dojos/events/user-events',
      redirect: '/dashboard/tickets',
      name: 'NgMyTickets',
      beforeEnter: loggedInNavGuard,
    },
    {
      path: '/dashboard/tickets',
      name: 'MyTickets',
      component: UserTickets,
      beforeEnter: loggedInNavGuard,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/v2',
      component: {
        template: '<router-view></router-view>',
      },
      children: [
        {
          path: 'events/:eventId',
          component: orderWrapper,
          props: true,
          children: [
            {
              path: '',
              component: EventDetails,
              props: true,
              children: [
                {
                  path: '',
                  name: 'LoginOrRegister',
                  component: LoginOrRegister,
                  props: true,
                },
                {
                  path: 'sessions',
                  name: 'EventSessions',
                  component: EventSessions,
                  props: true,
                  beforeEnter: loggedInNavGuard,
                },
              ],
            },
            {
              path: 'confirmation',
              name: 'EventBookingConfirmation',
              component: BookingConfirmation,
              props: true,
              beforeEnter: loggedInNavGuard,
            },
          ],
        },
        {
          path: 'events/:eventId/confirmation',
          name: 'EventBookingConfirmation',
          component: BookingConfirmation,
          props: true,
        },
      ],
    },
    {
      path: '/:path+',
      component: {
        template: '<div></div>',
        created() {
          window.location.reload(true);
        },
      },
    },
  ],
});
