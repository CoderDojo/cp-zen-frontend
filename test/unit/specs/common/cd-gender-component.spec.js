import vueUnitHelper from 'vue-unit-helper';
import GenderComponent from '@/common/cd-gender-component';

describe('Gender Component', () => {
  describe('methods.showWhy()', () => {
    it('should change the value of whyGender to true', async () => {
      // ARRANGE
      const vm = vueUnitHelper(GenderComponent);
      vm.whyGender = false;

      // ACT
      await vm.showWhy();

      // ASSERT
      expect(vm.whyGender).to.equal(true);
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
});
