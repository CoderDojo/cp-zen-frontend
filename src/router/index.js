import Vue from 'vue';
import Router from 'vue-router';
import DojoDetails from '@/dojos/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';
import UserTickets from '@/users/cd-tickets';
import EventDetails from '@/events/cd-event-details';
import LoginOrRegister from '@/users/cd-login-or-register';
import EventSessions from '@/events/cd-event-sessions';
import Booking from '@/events/cd-booking';
import BookingConfirmation from '@/events/cd-booking-confirmation';
import Login from '@/users/cd-login';

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
    },
    {
      path: '/dashboard/tickets',
      name: 'MyTickets',
      component: UserTickets,
    },
    {
      path: '/v2',
      component: {
        template: '<router-view></router-view>',
      },
      children: [
        {
          path: 'events/:eventId',
          component: EventDetails,
          props: true,
          children: [
            {
              path: '',
              name: 'EventDobVerification',
              component: LoginOrRegister,
              props: true,
            },
            {
              path: 'sessions',
              name: 'EventSessions',
              component: EventSessions,
              props: true,
            },
            {
              path: 'book',
              name: 'EventBookingForm',
              component: Booking,
              props: true,
            },
          ],
        },
        {
          path: 'events/:eventId/confirmation',
          name: 'EventBookingConfirmation',
          component: BookingConfirmation,
          props: true,
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
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
