import vueUnitHelper from 'vue-unit-helper';
import NumberSpinner from '@/common/cd-number-spinner';

describe('Number Spinner', () => {
  it('should increment when new value is <= to max', () => {
    const vm = vueUnitHelper(NumberSpinner);
    const bindingData = {
      max: 10,
      value: 5,
      $emit: sinon.stub(),
    };
    // ACT
    vm.increment.bind(bindingData)();

    // ASSERT
    expect(bindingData.value).to.equal(6);
    expect(bindingData.$emit).to.have.been.calledWith('update', bindingData.value);
  });

  it('should not increment when new value is > than max', () => {
    const vm = vueUnitHelper(NumberSpinner);
    const bindingData = {
      max: 10,
      value: 10,
      $emit: sinon.stub(),
    };

    // ACT
    vm.increment.bind(bindingData)();

    // ASSERT
    expect(bindingData.value).to.equal(10);
    expect(bindingData.$emit).not.to.have.been.called;
  });

  it('should decrement when new value is >= to min', () => {
    const vm = vueUnitHelper(NumberSpinner);
    const bindingData = {
      min: 0,
      value: 5,
      $emit: sinon.stub(),
    };
    // ACT
    vm.decrement.bind(bindingData)();

    // ASSERT
    expect(bindingData.value).to.equal(4);
    expect(bindingData.$emit).to.have.been.calledWith('update', bindingData.value);
  });

  it('should not decrement when new value is < than min', () => {
    const vm = vueUnitHelper(NumberSpinner);
    const bindingData = {
      min: 0,
      value: 0,
      $emit: sinon.stub(),
    };

    // ACT
    vm.decrement.bind(bindingData)();

    // ASSERT
    expect(bindingData.value).to.equal(0);
    expect(bindingData.$emit).not.to.have.been.called;
  });
});
