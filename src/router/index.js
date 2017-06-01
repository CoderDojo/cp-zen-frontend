import Vue from 'vue';
import Router from 'vue-router';
import DojoDetails from '@/dojos/cd-dojo-details';
import FindDojo from '@/dojos/cd-find-dojo';
import EventDetails from '@/events/cd-event-details';
import EventSessions from '@/events/cd-event-sessions';
import BookingParentForm from '@/events/cd-booking-parent-form';
import BookingCreateAccount from '@/events/cd-booking-create-account';
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
      path: '/dojos/:country/:region/:dojoName',
      name: 'DojoDetails',
      component: DojoDetails,
      props: true,
    },
    {
      path: '/events/:eventId',
      name: 'EventDetails',
      component: EventDetails,
      props: true,
    },
    {
      path: '/events/:eventId/sessions',
      name: 'EventSessions',
      component: EventSessions,
      props: true,
    },
    {
      path: '/events/:eventId/book',
      name: 'EventBookingForm',
      component: BookingParentForm,
      props: true,
    },
    {
      path: '/events/:eventId/create-account',
      name: 'EventBookingCreateAccount',
      component: BookingCreateAccount,
      props: true,
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
