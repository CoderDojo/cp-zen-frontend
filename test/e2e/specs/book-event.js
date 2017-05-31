const BookingParentData = require('../page-objects/booking-parent-data');
const BookingCreateAccount = require('../page-objects/booking-create-account');
const BookingConfirmation = require('../page-objects/booking-confirmation');

describe('Book event page', () => {
  it('should collect parent data', () => {
    BookingParentData.open(1);
    expect(BookingParentData.firstNameLabel.getText()).to.equal('First name');
    expect(BookingParentData.lastNameLabel.getText()).to.equal('Last name');
    expect(BookingParentData.phoneNumberLabel.getText()).to.equal('Phone number');
    expect(BookingParentData.emailLabel.getText()).to.equal('Email address');

    BookingParentData.firstName.setValue('John');
    BookingParentData.lastName.setValue('Doe');
    BookingParentData.phoneNumber.setValue('+1-555-123456');
    BookingParentData.email.setValue('john.doe@example.com');

    BookingParentData.submitBookingButton.click();

    BookingCreateAccount.password.waitForVisible();
    BookingCreateAccount.password.setValue('Passw0rd');
    BookingCreateAccount.confirmPassword.setValue('Passw0rd');
    BookingCreateAccount.termsAndConditions.click();
    BookingCreateAccount.checkRecaptcha();
    BookingCreateAccount.createAccount.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.accountCreationConfirmation.getText()).to.equal('Account created');
    expect(BookingConfirmation.firstName.getText()).to.equal('John');
    expect(BookingConfirmation.lastName.getText()).to.equal('Doe');
    expect(BookingConfirmation.phoneNumber.getText()).to.equal('+1-555-123456');
    expect(BookingConfirmation.email.getText()).to.equal('john.doe@example.com');
  });
});
