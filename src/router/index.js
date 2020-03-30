import Vue from 'vue';
import Router from 'vue-router';
import multiguard from 'vue-router-multiguard';
import DojoDetails from '@/dojos/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';
import UserTickets from '@/users/cd-tickets';
import EventDetails from '@/events/order/cd-event-details';
import LoginOrRegister from '@/users/cd-login-or-register';
import EventSessions from '@/events/order/cd-event-sessions';
import EventForm from '@/events/cd-event-form';
import BookingConfirmation from '@/events/order/cd-booking-confirmation';
import Login from '@/users/cd-login';
import AccountType from '@/users/cd-account-type';
import orderWrapper from '@/events/order/wrapper';
import UserService from '@/users/service';
import store from '@/store';
import Home from '@/dashboard/cd-dashboard';
import CDFManageUsers from '@/users/cdf-manage';
import ManageRequestToJoin from '@/dojos/manage-request-to-join';
import loggedInNavGuard from './loggedInNavGuard';
import loggedInCDFNavGuard from './loggedInCDFNavGuard';
import profileAuthRedirect from './profileAuthRedirect';
import orderExistsNavGuard from './orderExistsNavGuard';
import errorDisplayGuard from './errorDisplayGuard';
import ticketingAdminNavGuard from './ticketingAdminNavGuard';

Vue.use(Router);

const router = new Router({
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
      component: {
        template: '<router-view :key="$route.fullPath"></router-view>',
      },
      beforeEnter: multiguard([
        errorDisplayGuard,
        (to, from, next) => {
          store.dispatch('getLoggedInUser').then(() => next());
        },
      ]),
      children: [
        {
          path: '',
          name: 'root',
          beforeEnter(to, from, next) {
            if (store.getters.isLoggedIn) {
              return next({ name: 'Home' });
            }
            return next({ name: 'FindDojo', query: to.query });
          },
        },
        {
          path: '/find',
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
          path: '/dashboard/dojos/:dojoId/events/new',
          name: 'NewEventForm',
          component: EventForm,
          beforeEnter: multiguard([loggedInNavGuard, ticketingAdminNavGuard]),
        },
        {
          path: '/dashboard/dojos/:dojoId/events/:eventId/edit',
          name: 'EditEventForm',
          component: EventForm,
          beforeEnter: multiguard([loggedInNavGuard, ticketingAdminNavGuard]),
        },
        {
          path: '/dashboard/dojos/:dojoId/join-requests/:requestId/status/:status',
          name: 'ManageRequestToJoin',
          component: ManageRequestToJoin,
          beforeEnter: loggedInNavGuard,
        },
        {
          path: '/account-type',
          name: 'AccountType',
          component: AccountType,
        },
        {
          path: '/login',
          name: 'Login',
          component: Login,
          beforeEnter: profileAuthRedirect,
        },
        {
          path: '/home',
          name: 'Home',
          component: Home,
          beforeEnter: loggedInNavGuard,
        },
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
                  async beforeEnter(to, from, next) {
                    const loggedInUser = (await UserService.getCurrentUser()).body;
                    next(loggedInUser.login ? { name: 'EventSessions', params: to.params } : true);
                  },
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
          ],
        },
        {
          path: 'events/:eventId/confirmation',
          name: 'EventBookingConfirmation',
          component: BookingConfirmation,
          beforeEnter: multiguard([loggedInNavGuard, orderExistsNavGuard]),
          props: true,
        },
        {
          path: 'cdf/dashboard/users',
          name: 'CDFUsersManagement',
          component: CDFManageUsers,
          beforeEnter: loggedInCDFNavGuard,
        },
        // Kept for future development/transitions
        {
          path: '/v2',
          component: {
            template: '<router-view></router-view>',
          },
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

export default router;

