import EventService from '@/events/service';
import store from '@/store';

export default async function (to, from, next) {
  if (!from.name) {
    const user = store.getters.loggedInUser;
    const orders = (await EventService.v3.getOrder(user.id, { params: { 'query[eventId]': to.params.eventId } })).body;
    if (orders.results.length < 1) {
      return next({ name: 'EventSessions', params: to.params });
    }
  }
  return next(true);
}
