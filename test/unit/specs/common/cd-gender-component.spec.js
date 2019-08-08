import vueUnitHelper from 'vue-unit-helper';
import GenderComponent from '@/common/cd-gender-component';

describe('Gender Component', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('methods', () => {
    describe('methods.onBlur()', () => {
      it('should emit a blur event after 50ms and assign the timeout to blurTimeout', () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        sinon.stub(window, 'setTimeout').callsFake((cb) => {
          cb();
          return 'foo';
        });
        const emitStub = sinon.stub();
        vm.$emit = emitStub;

        // ACT
        vm.onBlur();

        // ASSERT
        expect(window.setTimeout).to.have.been.calledOnce;
        expect(window.setTimeout).to.have.been.calledWith(sinon.match.func, 50);
        expect(vm.$emit).to.have.been.calledOnce;
        expect(vm.$emit).to.have.been.calledWith('blur');
        expect(vm.blurTimeout).to.equal('foo');
      });
    });

    describe('methods.onFocus()', () => {
      it('should clear any existing blur timeout', () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        sinon.stub(window, 'clearTimeout');
        vm.blurTimeout = 'foo';

        // ACT
        vm.onFocus();

        // ASSERT
        expect(window.clearTimeout).to.have.been.calledOnce;
        expect(window.clearTimeout).to.have.been.calledWith('foo');
      });
    });
  });

  describe('computed', () => {
    describe('computed.specifyGender', () => {
      it('should return true if the selected gender has the value specify', async () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        vm.genderSelect = 'specify';

        // ACT

        // ASSERT
        expect(vm.specifyGender).to.equal(true);
      });

      it('should return false if the selected gender does not hav the value specify', async () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        vm.genderSelect = 'male';

        // ACT

        // ASSERT
        expect(vm.specifyGender).to.equal(false);
      });
    });

    describe('computed.gender', () => {
      it('should return the input gender value if the if the selected gender has the value specify', async () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        vm.genderSelect = 'specify';
        vm.genderInput = 'non-binary';

        // ACT

        // ASSERT
        expect(vm.gender).to.equal('non-binary');
      });

      it('should return the selected gender value if the selected gender does not have the value specify', async () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        vm.genderSelect = 'male';

        // ACT

        // ASSERT
        expect(vm.gender).to.equal('male');
      });
    });
  });

  describe('watch', () => {
    describe('gender()', () => {
      it('should emit an "input" event with the updated gender', () => {
        // ARRANGE
        const vm = vueUnitHelper(GenderComponent);
        const mockGender = 'female';
        const emitStub = sinon.stub();
        vm.$emit = emitStub;
        vm.gender = mockGender;

        // ACT
        vm.$watchers.gender();

        // ASSERT
        expect(emitStub).to.have.been.calledWith('input', mockGender);
      });
    });
  });
});
