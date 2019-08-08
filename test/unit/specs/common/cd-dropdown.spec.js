import vueUnitHelper from 'vue-unit-helper';
import Dropdown from '@/common/cd-dropdown';

describe('Dropdown component', () => {
  let vm;

  beforeEach(() => {
    vm = vueUnitHelper(Dropdown);
  });

  describe('computed.iconClass', () => {
    it('should return a class string with the provided icon', () => {
      // ARRANGE
      vm.icon = 'foo';

      // ASSERT
      expect(vm.iconClass).to.equal('fa fa-foo');
    });
  });

  describe('computed.buttonClass', () => {
    it('should return a class string with the provided type', () => {
      // ARRANGE
      vm.type = 'foo';

      // ASSERT
      expect(vm.buttonClass).to.equal('btn btn-foo dropdown-toggle');
    });
  });

  describe('methods.onButtonBlur(event)', () => {
    let containsStub;
    let mockEvent;

    beforeEach(() => {
      containsStub = sinon.stub();
      mockEvent = {
        relatedTarget: 'foo',
        srcElement: {
          parentNode: {
            contains: containsStub,
          },
        },
      };
    });

    it('should set open to false when relatedTarget is not in component', () => {
      // ARRANGE
      vm.open = true;
      containsStub.withArgs(mockEvent.relatedTarget).returns(false);

      // ACT
      vm.onButtonBlur(mockEvent);

      // ASSERT
      expect(vm.open).to.equal(false);
    });

    it('should not set open to false when relatedTarget is in component', () => {
      // ARRANGE
      vm.open = true;
      containsStub.withArgs(mockEvent.relatedTarget).returns(true);

      // ACT
      vm.onButtonBlur(mockEvent);

      // ASSERT
      expect(vm.open).to.equal(true);
    });
  });
});
