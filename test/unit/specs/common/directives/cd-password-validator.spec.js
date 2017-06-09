import PasswordValidator from '@/common/directives/cd-password-validator';

describe('Password validator', () => {
  it('should validate a password', () => {
    const passwords = [
      { value: null, expectedResult: false },
      { value: undefined, expectedResult: false },
      { value: '', expectedResult: false },
      { value: 'abcd', expectedResult: false },
      { value: 'abcd1', expectedResult: false },
      { value: '       8', expectedResult: true },
      { value: 'abcdefgh', expectedResult: false },
      { value: 'abcdefg1', expectedResult: true },
      { value: '12345678', expectedResult: true },
    ];

    passwords.forEach((password) => {
      expect(PasswordValidator.validate(password.value)).to.equal(password.expectedResult);
    });
    expect(PasswordValidator.getMessage()).to.equal('The password should be at least 8 characters and contain at least one numeric character.');
  });
});
