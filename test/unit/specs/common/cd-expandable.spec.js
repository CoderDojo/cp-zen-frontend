import vueUnitHelper from 'vue-unit-helper';
import Expandable from '@/common/cd-expandable';

describe('Expandable component', () => {
  let sandbox;
  let vm;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    vm = vueUnitHelper(Expandable);
  });

  describe('computed.linkName', () => {
    it('should return Retract if the component is closed', () => {
      // ARRANGE
      vm.expanded = false;

      // ASSERT
      expect(vm.linkName).to.equal('Read full event details');
    });
    it('should return Read full details if the component is expanded', () => {
      // ARRANGE
      vm.expanded = true;

      // ASSERT
      expect(vm.linkName).to.equal('Retract');
    });
  });

});
