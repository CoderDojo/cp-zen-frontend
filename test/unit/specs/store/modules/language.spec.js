import { mutations, actions, getters } from '@/store/modules/language';
import { expect } from 'chai';

describe('Language Store', () => {
  describe('mutations', () => {
    const { setChosenLanguageConfig } = mutations
    it('setChosenLanguageConfig', () => {
      const state = { chosenLanguageConfig: null };
      const newLanguageConfig = { dir: 'test' };

      setChosenLanguageConfig(state, newLanguageConfig);

      expect(state.chosenLanguageConfig.dir).to.eq('test');
    });
  });

  describe('actions', () => {
    it('updateChosenLanguageConfig', () => {
      const commit = sinon.spy()
      const state = {};

      const chosenLanguageConfig = { dir: 'down' };

      actions.updateChosenLanguageConfig({ commit, state }, chosenLanguageConfig);

      expect(commit.args).to.deep.equal([['setChosenLanguageConfig', chosenLanguageConfig]]);
    });
  });

  describe('getters', () => {
    it('chosenLanguageConfig', () => {
      const state = { chosenLanguageConfig: { dir: 'left' } };
      expect(getters.chosenLanguageConfig(state).dir).to.eq('left');
    });
  });
});
