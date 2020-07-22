import vueUnitHelper from 'vue-unit-helper';
import TextDirectionWrapper from '@/common/cd-text-direction-wrapper';

describe('Text Direction Wrapper', () => {

  describe('computed.textDirection', () => {
    context('when chosen language specifies a direction', () => {
      it('returns that value', () => {
        const vm = vueUnitHelper(TextDirectionWrapper);
        vm.$store = {
          getters: {
            get chosenLanguageConfig() { return { dir: 'test' }},
          },
        };
        expect(vm.textDirection).to.eql('test');
      });
    });

    context('when chosen language doesn\'t specify a direction', () => {
      it('returns default', () => {
        const vm = vueUnitHelper(TextDirectionWrapper);
        vm.$store = {
          getters: {
            get chosenLanguageConfig() { return { }},
          },
        };
        expect(vm.textDirection).to.eql('ltr');
      });
    });

    context('when initialised with a prop', () => {
      it('overrides the chosen language direction', () => {
        const vm = vueUnitHelper(TextDirectionWrapper);
        vm.direction = 'down'
        vm.$store = {
          getters: {
            get chosenLanguageConfig() { return { dir: 'test' }},
          },
        };
        expect(vm.textDirection).to.eql('down');
      });
    });
  });
});
