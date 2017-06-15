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
  DojoDetailsPage.eventViewButtons(0).click();

  EventDetailsPage.dateOfBirthDayInput.setValue('27');
  EventDetailsPage.dateOfBirthMonthInput.setValue('03');
  EventDetailsPage.dateOfBirthYearInput.setValue('1980');
  EventDetailsPage.nextButton.click();

  EventSessionsPage.ticketCounterIncrement(1).click();
  EventSessionsPage.ticketCounterIncrement(4).click();
  EventSessionsPage.ticketCounterIncrement(4).click();

  EventSessionsPage.nextButton.click();
}

describe('Book event page', () => {
  it('should collect parent data', () => {
    startBooking();

    expect(Booking.allTickets().length).to.equal(2);
    expect(Booking.tickets(0).getText()).to.equal('1 X Parent (Scratch)');
    expect(Booking.tickets(1).getText()).to.equal('2 X Laptop required (Arduino)');

    expect(Booking.firstNameLabel.getText()).to.equal('First name');
    expect(Booking.lastNameLabel.getText()).to.equal('Last name');
    expect(Booking.phoneNumberLabel.getText()).to.equal('Phone number');
    expect(Booking.emailLabel.getText()).to.equal('Email address');

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    expect(Booking.sessionTicketTitle[0].getText()).to.equal('Laptop required (Arduino)');

    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth[0].setValue('01');
    Booking.sessionTicketMonthOfBirth[0].setValue('01');
    Booking.sessionTicketYearOfBirth[0].setValue('2008');
    Booking.sessionTicketEmailAddress[0].setValue('child@one.org');
    Booking.sessionTicketGender('Male')[0].click();

    expect(Booking.sessionTicketTitle[1].getText()).to.equal('Laptop required (Arduino)');
    Booking.sessionTicketFirstName[1].setValue('Child');
    Booking.sessionTicketLastName[1].setValue('Two');
    Booking.sessionTicketDayOfBirth[1].setValue('10');
    Booking.sessionTicketMonthOfBirth[1].setValue('10');
    Booking.sessionTicketYearOfBirth[1].setValue('2006');
    Booking.sessionTicketEmailAddress[1].setValue('child@two.org');
    Booking.sessionTicketGender('Female')[1].click();

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

    expect(BookingConfirmation.childFirstName[0].getText()).to.equal('Child');
    expect(BookingConfirmation.childLastName[0].getText()).to.equal('One');
    expect(BookingConfirmation.childDayOfBirth[0].getText()).to.equal('01');
    expect(BookingConfirmation.childMonthOfBirth[0].getText()).to.equal('01');
    expect(BookingConfirmation.childYearOfBirth[0].getText()).to.equal('2008');
    expect(BookingConfirmation.childEmailAddress[0].getText()).to.equal('child@one.org');
    expect(BookingConfirmation.childGender[0].getText()).to.equal('Male');

    expect(BookingConfirmation.childFirstName[1].getText()).to.equal('Child');
    expect(BookingConfirmation.childLastName[1].getText()).to.equal('Two');
    expect(BookingConfirmation.childDayOfBirth[1].getText()).to.equal('10');
    expect(BookingConfirmation.childMonthOfBirth[1].getText()).to.equal('10');
    expect(BookingConfirmation.childYearOfBirth[1].getText()).to.equal('2006');
    expect(BookingConfirmation.childEmailAddress[1].getText()).to.equal('child@two.org');
    expect(BookingConfirmation.childGender[1].getText()).to.equal('Female');

    expect(BookingConfirmation.bookingConfirmationMessage.getText()).to.equal('Your booking is completed successfully');
  });

  it('should show the other gender', () => {
    startBooking();

    expect(Booking.allTickets().length).to.equal(2);
    expect(Booking.tickets(0).getText()).to.equal('1 X Parent (Scratch)');
    expect(Booking.tickets(1).getText()).to.equal('2 X Laptop required (Arduino)');

    expect(Booking.firstNameLabel.getText()).to.equal('First name');
    expect(Booking.lastNameLabel.getText()).to.equal('Last name');
    expect(Booking.phoneNumberLabel.getText()).to.equal('Phone number');
    expect(Booking.emailLabel.getText()).to.equal('Email address');

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    expect(Booking.sessionTicketTitle[0].getText()).to.equal('Laptop required (Arduino)');

    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth[0].setValue('01');
    Booking.sessionTicketMonthOfBirth[0].setValue('01');
    Booking.sessionTicketYearOfBirth[0].setValue('2008');
    Booking.sessionTicketEmailAddress[0].setValue('child@one.org');
    Booking.sessionTicketGender('Other')[0].click();
    Booking.sessionOtherGender[0].setValue('another gender');

    expect(Booking.sessionTicketTitle[1].getText()).to.equal('Laptop required (Arduino)');
    Booking.sessionTicketFirstName[1].setValue('Child');
    Booking.sessionTicketLastName[1].setValue('Two');
    Booking.sessionTicketDayOfBirth[1].setValue('10');
    Booking.sessionTicketMonthOfBirth[1].setValue('10');
    Booking.sessionTicketYearOfBirth[1].setValue('2006');
    Booking.sessionTicketEmailAddress[1].setValue('child@two.org');
    Booking.sessionTicketGender('Female')[1].click();

    Booking.submitBookingButton.click();

    BookingCreateAccount.password.waitForVisible();
    BookingCreateAccount.password.setValue('Passw0rd');
    BookingCreateAccount.confirmPassword.setValue('Passw0rd');
    BookingCreateAccount.termsAndConditions.click();
    BookingCreateAccount.dataConsent.click();
    BookingCreateAccount.checkRecaptcha();
    BookingCreateAccount.createAccount.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.childGender[0].getText()).to.equal('Other (another gender)');
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

    BookingCreateAccount.password.setValue('foo');
    BookingCreateAccount.confirmPassword.setValue('foo');
    expect(BookingCreateAccount.passwordError.getText()).to.equal('The password should be at least 8 characters and contain at least one numeric character.');

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
