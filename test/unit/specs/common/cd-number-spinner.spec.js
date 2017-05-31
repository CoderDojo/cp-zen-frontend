import vueUnitHelper from 'vue-unit-helper';
import NumberSpinner from '@/common/cd-number-spinner';

describe('Number Spinner', () => {
  it('should increment when new value is <= to max', () => {
    const vm = vueUnitHelper(NumberSpinner);
    vm.max = 10;
    vm.value = 5;

    // ACT
    vm.increment();

    // ASSERT
    expect(vm.value).to.equal(6);
  });

  it('should not increment when new value is > than max', () => {
    const vm = vueUnitHelper(NumberSpinner);
    vm.max = 10;
    vm.value = 10;

    // ACT
    vm.increment();

    // ASSERT
    expect(vm.value).to.equal(10);
  });

  it('should decrement when new value is >= to min', () => {
    const vm = vueUnitHelper(NumberSpinner);
    vm.min = 0;
    vm.value = 5;

    // ACT
    vm.decrement();

    // ASSERT
    expect(vm.value).to.equal(4);
  });

  it('should not decrement when new value is < than min', () => {
    const vm = vueUnitHelper(NumberSpinner);
    vm.min = 0;
    vm.value = 0;

    // ACT
    vm.decrement();

    // ASSERT
    expect(vm.value).to.equal(0);
  });
});
