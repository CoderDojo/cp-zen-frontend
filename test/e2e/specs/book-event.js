const Booking = require('../page-objects/booking');
const BookingCreateAccount = require('../page-objects/booking-create-account');
const BookingConfirmation = require('../page-objects/booking-confirmation');
const DojoPage = require('../page-objects/dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDetailsPage = require('../page-objects/event-details');
const EventSessionsPage = require('../page-objects/event-sessions');

function startBooking() {
  DojoPage.openDojoWithLatLong(10, 89);
  DojoDetailsPage.name.waitForVisible();
  DojoDetailsPage.eventNames(0).click();

  EventDetailsPage.dateOfBirthDayInput.setValue('27');
  EventDetailsPage.dateOfBirthMonthInput.setValue('03');
  EventDetailsPage.dateOfBirthYearInput.setValue('1980');
  EventDetailsPage.nextButton.click();

  EventSessionsPage.ticketCounterIncrement(1).click();
  EventSessionsPage.ticketCounterIncrement(4).click();

  EventSessionsPage.nextButton.click();
}

describe('Book event page', () => {
  it('should collect parent data', () => {
    startBooking();

    expect(Booking.allTickets().length).to.equal(2);
    expect(Booking.tickets(0).getText()).to.equal('1 X Parent (Scratch)');
    expect(Booking.tickets(1).getText()).to.equal('1 X Laptop required (Arduino)');

    expect(Booking.firstNameLabel.getText()).to.equal('First name');
    expect(Booking.lastNameLabel.getText()).to.equal('Last name');
    expect(Booking.phoneNumberLabel.getText()).to.equal('Phone number');
    expect(Booking.emailLabel.getText()).to.equal('Email address');

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    Booking.submitBookingButton.click();

    BookingCreateAccount.password.waitForVisible();
    expect(BookingCreateAccount.dataUsageLink.isVisible()).to.be.true;
    expect(BookingCreateAccount.termsAndConditionsLink.isVisible()).to.be.true;
    BookingCreateAccount.password.setValue('Passw0rd');
    BookingCreateAccount.confirmPassword.setValue('Passw0rd');
    BookingCreateAccount.termsAndConditions.click();
    BookingCreateAccount.dataConsent.click();
    BookingCreateAccount.checkRecaptcha();
    BookingCreateAccount.createAccount.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.accountCreationConfirmation.getText()).to.equal('Account created');
    expect(BookingConfirmation.firstName.getText()).to.equal('John');
    expect(BookingConfirmation.lastName.getText()).to.equal('Doe');
    expect(BookingConfirmation.phoneNumber.getText()).to.equal('1555123456');
    expect(BookingConfirmation.email.getText()).to.equal('john.doe@example.com');
  });

  it('should report validation errors for not filling in required fields', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    Booking.submitBookingButton.click();

    BookingCreateAccount.checkRecaptcha();
    BookingCreateAccount.createAccount.click();
    expect(BookingCreateAccount.passwordError.getText()).to.equal('The password field is required.');
    expect(BookingCreateAccount.confirmPasswordError.getText()).to.equal('The password confirmation field is required.');
    expect(BookingCreateAccount.termsAndConditionsError.getText()).to.equal('You must accept the terms and conditions before proceeding.');
    expect(BookingCreateAccount.dataConsentError.getText()).to.equal('You must consent to the use of your data before proceeding.');

    BookingCreateAccount.password.setValue('Passw0rd');
    BookingCreateAccount.confirmPassword.setValue('No-Passw0rd');

    expect(BookingCreateAccount.passwordError.getText()).to.equal('The password confirmation does not match.');
  });

  it('should report validation errors for invalid phone number', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('+1-555-12-3456');
    Booking.email.setValue('john.doe@example.com');

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.phoneNumberValidationError.getText()).to.equal('The phone number field may only contain numeric characters.');
  });

  it('should report validation errors for invalid email', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe');

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.emailValidationError.getText()).to.equal('The email field must be a valid email.');
  });

  it('should report validation errors missing required fields', () => {
    startBooking();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.phoneNumberValidationError.getText()).to.equal('The phone number field is required.');
    expect(Booking.firstNameValidationError.getText()).to.equal('The first name field is required.');
    expect(Booking.lastNameValidationError.getText()).to.equal('The last name field is required.');
    expect(Booking.emailValidationError.getText()).to.equal('The email field is required.');
  });
});
