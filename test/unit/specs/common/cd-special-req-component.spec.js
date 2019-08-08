import vueUnitHelper from 'vue-unit-helper';
import SpecialReqComponent from '@/common/cd-special-req-component';

describe('Special Requirement Component', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('methods', () => {
    describe('methods.showSpecialReq()', () => {
      it('should change hasSpecialReq to be true when it is called', () => {
        // ARRANGE
        const vm = vueUnitHelper(SpecialReqComponent);
        vm.hasSpecialReq = false;

        // ACT
        vm.showSpecialReq();
        // ASSERT
        expect(vm.hasSpecialReq).to.equal(true);
      });
    });
  });

  describe('computed.specialRequirement', () => {
    it('should return the input requirement value', async () => {
      // ARRANGE
      const vm = vueUnitHelper(SpecialReqComponent);
      vm.specialReqInput = 'Need wheelchair access';

      // ACT

      // ASSERT
      expect(vm.specialRequirement).to.equal('Need wheelchair access');
    });

    it('should return the undefined value if there is no input', async () => {
      // ARRANGE
      const vm = vueUnitHelper(SpecialReqComponent);
      vm.specialReqInput = '';

      // ACT

      // ASSERT
      expect(vm.specialRequirement).to.equal('');
    });
  });

  describe('watch', () => {
    describe('specialRequirement()', () => {
      it('should emit an "input" event with any updated specialRequirement', () => {
        // ARRANGE
        const vm = vueUnitHelper(SpecialReqComponent);
        const mockSpecialReq = 'Need lots of desk space';
        const emitStub = sinon.stub();
        vm.$emit = emitStub;
        vm.specialRequirement = mockSpecialReq;

        // ACT
        vm.$watchers.specialRequirement();

        // ASSERT
        expect(emitStub).to.have.been.calledWith('input', mockSpecialReq);
      });
    });
  });
});
