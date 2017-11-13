import vueUnitHelper from 'vue-unit-helper';
import Expandable from '@/common/cd-expandable';

describe('Expandable component', () => {
  let vm;

  beforeEach(() => {
    vm = vueUnitHelper(Expandable);
  });

  describe('mounted', () => {
    it('should set expandable truthy if it\'s over 10ch/80px', (done) => {
      vm.isExpandable = true;
      vm.$el = {
        querySelector: sinon.stub().returns({ clientHeight: 81 }),
      };
      vm.$lifecycleMethods.mounted();
      vm.$nextTick(() => {
        expect(vm.isExpandable).to.be.true;
        done();
      });
    });
    it('should set expandable falsy if it\'s over 10ch/80px', (done) => {
      vm.isExpandable = true;
      vm.$el = {
        querySelector: sinon.stub().returns({ clientHeight: 20 }),
      };
      vm.$lifecycleMethods.mounted();
      vm.$nextTick(() => {
        expect(vm.isExpandable).to.be.false;
        done();
      });
    });
  });
  describe('computed.linkName', () => {
    it('should return Read full event details if the component is closed', () => {
      // ARRANGE
      vm.expanded = false;

      // ASSERT
      expect(vm.linkName).to.equal('Read full event details');
    });
    it('should return Hide if the component is expanded', () => {
      // ARRANGE
      vm.expanded = true;

      // ASSERT
      expect(vm.linkName).to.equal('Hide');
    });
  });
});
