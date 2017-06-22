import UserUtils from '@/users/util';

describe('User Utils', () => {
  describe('isUnderAge()', () => {
    it('should return true if given dob is less than 13 years old', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 12);

      // ACT + ASSERT
      expect(UserUtils.isUnderAge(dob)).to.be.true;
    });

    it('should return false if given dob is 13 years old', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 13);

      // ACT + ASSERT
      expect(UserUtils.isUnderAge(dob)).to.be.false;
    });

    it('should return false if given dob is over 13 years old', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 14);

      // ACT + ASSERT
      expect(UserUtils.isUnderAge(dob)).to.be.false;
    });
  });
});
