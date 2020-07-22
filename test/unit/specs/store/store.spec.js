import store from '@/store/';
import { expect } from 'chai';

describe('Store', () => {
  describe('mutations', () => {
    // it('setChosenLanguageConfig', () => {
    //   console.log('store ', store);
    //   const newLanguageConfig = { dir: 'test' };

    //   store.commit('setChosenLanguageConfig', newLanguageConfig);

    //   expect(store.state.chosenLanguageConfig.dir).to.eq('test');
    // });

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

  // describe('actions', () => {
  //   it('updateChosenLanguageConfig', () => {
  //     console.log('actions: ', store._actions);
  //     const commit = sinon.spy()
  //     const state = {};
  //   });
  // });
});
