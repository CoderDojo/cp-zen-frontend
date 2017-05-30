const BookingParentData = require('../page-objects/booking-parent-data');
const BookingConfirmation = require('../page-objects/booking-confirmation');

describe('Book event page', () => {
  it('should collect parent data', () => {
    BookingParentData.open(1);
    expect(BookingParentData.nameLabel.getText()).to.equal('Name');
    expect(BookingParentData.phoneNumberLabel.getText()).to.equal('Phone Number');
    expect(BookingParentData.emailLabel.getText()).to.equal('Email Address');

    BookingParentData.firstName.setValue('John');
    BookingParentData.lastName.setValue('Doe');
    BookingParentData.phoneNumber.setValue('+1-555-123456');
    BookingParentData.email.setValue('john.doe@example.com');

    BookingParentData.submitBookingButton.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.firstName.getText()).to.equal('John');
    expect(BookingConfirmation.lastName.getText()).to.equal('Doe');
    expect(BookingConfirmation.phoneNumber.getText()).to.equal('+1-555-123456');
    expect(BookingConfirmation.email.getText()).to.equal('john.doe@example.com');
  });
});
