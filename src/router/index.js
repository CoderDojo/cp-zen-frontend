import Vue from 'vue';
import Router from 'vue-router';
import DojoDetails from '@/dojos/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';
import EventDetails from '@/events/cd-event-details';
import EventDobVerification from '@/events/cd-event-dob-verification';
import EventSessions from '@/events/cd-event-sessions';
import Booking from '@/events/cd-booking';
import BookingConfirmation from '@/events/cd-booking-confirmation';

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
      path: '/dojos/:country([A-Za-z]{2})/:path+',
      name: 'DojoDetails',
      component: DojoDetails,
      props: true,
    },
    {
      path: '/events/:eventId',
      component: EventDetails,
      props: true,
      children: [
        {
          path: '',
          name: 'EventDobVerification',
          component: EventDobVerification,
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
      path: '/events/:eventId/confirmation',
      name: 'EventBookingConfirmation',
      component: BookingConfirmation,
      props: true,
    },
    {
      path: '/:lat/:long',
      name: 'FindDojoWithLatAndLong',
      component: FindDojo,
      props: true,
    },
  ],
});
