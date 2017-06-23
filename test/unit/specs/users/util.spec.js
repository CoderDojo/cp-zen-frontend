import UserUtils from '@/users/util';

describe('User Utils', () => {
  describe('getAge()', () => {
    it('should return 13 when given a 13 year old dob', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 13);

      // ACT + ASSERT
      expect(UserUtils.getAge(dob)).to.equal(13);
    });
    it('should return 18 when given a 18 year old dob', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 18);

      // ACT + ASSERT
      expect(UserUtils.getAge(dob)).to.equal(18);
    });
  });
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
  describe('isYouthOverThirteen()', () => {
    it('should return true if given dob is between 12 and 18 years old (not inclusive)', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 16);

      // ACT + ASSERT
      expect(UserUtils.isYouthOverThirteen(dob)).to.be.true;
    });
    it('should return false if given dob is above 17 years old', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 18);

      // ACT + ASSERT
      expect(UserUtils.isYouthOverThirteen(dob)).to.be.false;
    });
    it('should return false if given dob is under 13 years old years old', () => {
      // ARRANGE
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 12);

      // ACT + ASSERT
      expect(UserUtils.isYouthOverThirteen(dob)).to.be.false;
    });
  });
});
