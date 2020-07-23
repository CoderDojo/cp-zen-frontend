import store from '@/store/';
import { expect } from 'chai';

describe('Store', () => {
  describe('mutations', () => {
    it('setLoggedInUser', () => {
      const user = { user: 'bob' };

      store.commit('setLoggedInUser', user);

      expect(store.state.loggedInUser.user).to.eq('bob');
    });

    it('setDojo', () => {
      const dojo = { name: 'SuperDojo' };

      store.commit('setDojo', dojo);

      expect(store.state.dojo.name).to.eq('SuperDojo');
    });
  });
});
