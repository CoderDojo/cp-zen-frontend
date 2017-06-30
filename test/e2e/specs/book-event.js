const Booking = require('../page-objects/booking');
const BookingConfirmation = require('../page-objects/booking-confirmation');
const DojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDobVerificationPage = require('../page-objects/event-dob-verification');
const EventSessionsPage = require('../page-objects/event-sessions');

function checkHeaderContent(page) {
  expect(page.bookEventTitle.getText()).to.equal('Book Event');
  expect(page.eventTitle.getText()).to.equal('My First Amazing Event');
}

function checkEventDetails(page) {
  page.sectionIcon[0].waitForVisible();
  expect(page.sectionHeading[0].getText()).to.equal('TIME');
  expect(page.sectionValue[0].getText()).to.equal('June 6, 2017');
  expect(page.sectionValue[1].getText()).to.equal('4:30pm - 6pm');
  page.sectionIcon[1].waitForVisible();
  expect(page.sectionHeading[1].getText()).to.equal('LOCATION');
  expect(page.sectionValue[2].getText()).to.equal('CHQ, Dublin, Ireland');
}

function checkRecurringEventDetails(page) {
  page.sectionIcon[0].waitForVisible();
  expect(page.sectionHeading[0].getText()).to.equal('TIME');
  expect(page.sectionValue[0].getText()).to.equal('Next in series: July 1, 2017');
  expect(page.sectionValue[1].getText()).to.equal('10am - 12pm');
  expect(page.sectionValue[2].getText()).to.equal('Every two weeks on Saturdays');
  page.sectionIcon[1].waitForVisible();
  expect(page.sectionHeading[1].getText()).to.equal('LOCATION');
  expect(page.sectionValue[3].getText()).to.equal('CHQ, Dublin, Ireland');
}

function startBooking() {
  DojoPage.openDojoWithLatLong(10, 89);
  DojoDetailsPage.name.waitForVisible();
  DojoDetailsPage.eventViewButtons(0).click();

  expect(EventDobVerificationPage.verifyAgeMessage.getText()).to.equal('Please verify your age');
  expect(EventDobVerificationPage.dobInputLabel.getText()).to.equal('Enter your Date of Birth');

  EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
  EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
  EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
  EventDobVerificationPage.verify.click();

  EventSessionsPage.ticketCounterIncrement(1).click();
  EventSessionsPage.ticketCounterIncrement(4).click();
  EventSessionsPage.ticketCounterIncrement(4).click();

  EventSessionsPage.nextButton.click();
}

describe('Book event page', () => {
  it('should collect parent data', () => {
    startBooking();

    expect(Booking.attendeeHeading.getText()).to.equal('Attendee Information');
    expect(Booking.selectedTicketsHeading.getText()).to.equal('Selected Tickets');
    expect(Booking.allTickets().length).to.equal(2);
    expect(Booking.tickets(0).getText()).to.equal('1 x Parent\nScratch');
    expect(Booking.tickets(1).getText()).to.equal('2 x Laptop required\nArduino');

    expect(Booking.attendeeTypeHeader[0].getText()).to.equal('Parent / Guardian');
    expect(Booking.nameLabel.getText()).to.equal('Name');
    expect(Booking.phoneNumberLabel.getText()).to.equal('Phone Number');
    expect(Booking.emailLabel.getText()).to.equal('Email Address');

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    expect(Booking.attendeeTypeHeader[1].getText()).to.equal('Laptop required (Arduino)');
    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth(0).selectByValue('1');
    Booking.sessionTicketMonthOfBirth(0).selectByValue('0');
    Booking.sessionTicketYearOfBirth(0).selectByValue('2008');
    Booking.sessionTicketGender('Male')[0].click();

    expect(Booking.attendeeTypeHeader[2].getText()).to.equal('Laptop required (Arduino)');
    Booking.sessionTicketFirstName[1].setValue('Child');
    Booking.sessionTicketLastName[1].setValue('Two');
    Booking.sessionTicketDayOfBirth(1).selectByValue('10');
    Booking.sessionTicketMonthOfBirth(1).selectByValue('9');
    Booking.sessionTicketYearOfBirth(1).selectByValue('2006');
    Booking.sessionTicketGender('Female')[1].click();

    expect(Booking.termsAndConditionsLink.isVisible()).to.be.true;
    Booking.password.setValue('Passw0rd');
    Booking.confirmPassword.setValue('Passw0rd');
    Booking.termsAndConditions.click();
    Booking.checkRecaptcha();

    Booking.submitBookingButton.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.accountCreationConfirmation.getText()).to.equal('Account created');
    expect(BookingConfirmation.firstName.getText()).to.equal('John');
    expect(BookingConfirmation.lastName.getText()).to.equal('Doe');
    expect(BookingConfirmation.dateOfBirth.getText()).to.equal('1980-04-27T00:00:00.000Z');
    expect(BookingConfirmation.phoneNumber.getText()).to.equal('1555123456');
    expect(BookingConfirmation.email.getText()).to.equal('john.doe@example.com');

    expect(BookingConfirmation.bookingFirstName[0].getText()).to.equal('John');
    expect(BookingConfirmation.bookingLastName[0].getText()).to.equal('Doe');
    expect(BookingConfirmation.bookingEmailAddress[0].getText()).to.equal('john.doe@example.com');

    expect(BookingConfirmation.bookingFirstName[1].getText()).to.equal('Child');
    expect(BookingConfirmation.bookingLastName[1].getText()).to.equal('One');
    expect(BookingConfirmation.bookingDateOfBirth[1].getText()).to.equal('2008-01-01T00:00:00.000Z');
    expect(BookingConfirmation.bookingGender[1].getText()).to.equal('Male');

    expect(BookingConfirmation.bookingFirstName[2].getText()).to.equal('Child');
    expect(BookingConfirmation.bookingLastName[2].getText()).to.equal('Two');
    expect(BookingConfirmation.bookingDateOfBirth[2].getText()).to.equal('2006-10-10T00:00:00.000Z');
    expect(BookingConfirmation.bookingGender[2].getText()).to.equal('Female');

    expect(BookingConfirmation.bookingConfirmationMessage.getText()).to.equal('Your booking is completed successfully');
  });

  it('should show youth email input field when youth is booking', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned13.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned13.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned13.getFullYear());
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(0).click();
    EventSessionsPage.nextButton.click();

    Booking.sessionTicketEmailAddress[0].waitForVisible();
    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth(0).selectByValue('1');
    Booking.sessionTicketMonthOfBirth(0).selectByValue('0');
    Booking.sessionTicketYearOfBirth(0).selectByValue('2008');
    Booking.sessionTicketEmailAddress[0].setValue('child@one.org');
    Booking.sessionTicketGender('Male')[0].click();

    Booking.password.setValue('Passw0rd');
    Booking.confirmPassword.setValue('Passw0rd');
    Booking.termsAndConditions.click();
    Booking.checkRecaptcha();

    Booking.submitBookingButton.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.bookingEmailAddress[0].getText()).to.equal('child@one.org');
  });

  it('should not show youth email input field when parent is booking', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned20 = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned20.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned20.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned20.getFullYear());
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(1).click();
    EventSessionsPage.ticketCounterIncrement(4).click();
    EventSessionsPage.nextButton.click();

    Booking.firstName.waitForVisible();

    expect(Booking.sessionTicketEmailAddress[0]).to.equal(undefined);
  });

  it('should show the other gender', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth(0).selectByValue('1');
    Booking.sessionTicketMonthOfBirth(0).selectByValue('0');
    Booking.sessionTicketYearOfBirth(0).selectByValue('2008');
    Booking.sessionTicketGender('Other')[0].click();
    Booking.sessionOtherGender[0].setValue('another gender');

    Booking.sessionTicketFirstName[1].setValue('Child');
    Booking.sessionTicketLastName[1].setValue('Two');
    Booking.sessionTicketDayOfBirth(1).selectByValue('10');
    Booking.sessionTicketMonthOfBirth(1).selectByValue('9');
    Booking.sessionTicketYearOfBirth(1).selectByValue('2006');
    Booking.sessionTicketGender('Female')[1].click();

    Booking.password.waitForVisible();
    Booking.password.setValue('Passw0rd');
    Booking.confirmPassword.setValue('Passw0rd');
    Booking.termsAndConditions.click();
    Booking.checkRecaptcha();

    Booking.submitBookingButton.click();

    BookingConfirmation.firstName.waitForVisible();

    expect(BookingConfirmation.bookingGender[1].getText()).to.equal('another gender');
  });

  it('should report validation errors for not filling in required fields', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    Booking.submitBookingButton.click();

    expect(browser.alertText()).to.equal('Please complete the reCAPTCHA.');
    browser.alertAccept();

    Booking.checkRecaptcha();

    Booking.submitBookingButton.click();

    expect(Booking.passwordError.getText()).to.equal('The password field is required.');
    expect(Booking.confirmPasswordError.getText()).to.equal('The password confirmation field is required.');
    expect(Booking.termsAndConditionsError.getText()).to.equal('You must accept the terms and conditions before proceeding.');

    Booking.password.setValue('foo');
    Booking.confirmPassword.setValue('foo');
    expect(Booking.passwordError.getText()).to.equal('The password should be at least 8 characters and contain at least one numeric character.');

    Booking.password.setValue('Passw0rd');
    Booking.confirmPassword.setValue('No-Passw0rd');
    expect(Booking.passwordError.getText()).to.equal('The password confirmation does not match.');
  });

  it('should report validation errors for invalid phone number', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('+1-555-12-3456');
    Booking.email.setValue('john.doe@example.com');
    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.phoneNumberValidationError.getText()).to.equal('The phone number field may only contain numeric characters.');
  });

  it('should report validation errors for invalid email', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.dateOfBirthDayInput.selectByValue('27');
    Booking.dateOfBirthMonthInput.selectByValue('3');
    Booking.dateOfBirthYearInput.selectByValue('1980');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe');
    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.emailValidationError.getText()).to.equal('The email field must be a valid email.');
  });

  it('should report validation errors missing required fields', () => {
    startBooking();
    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.phoneNumberValidationError.getText()).to.equal('The phone number field is required.');
    expect(Booking.firstNameValidationError.getText()).to.equal('The first name field is required.');
    expect(Booking.lastNameValidationError.getText()).to.equal('The last name field is required.');
    expect(Booking.emailValidationError.getText()).to.equal('The email field is required.');
  });

  it('should show the proper event details for recurring event', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(1).click();

    expect(EventDobVerificationPage.verifyAgeMessage.getText()).to.equal('Please verify your age');
    expect(EventDobVerificationPage.dobInputLabel.getText()).to.equal('Enter your Date of Birth');
    checkRecurringEventDetails(EventDobVerificationPage);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    checkRecurringEventDetails(EventSessionsPage);
    EventSessionsPage.ticketCounterIncrement(1).click();
    EventSessionsPage.ticketCounterIncrement(4).click();
    EventSessionsPage.ticketCounterIncrement(4).click();

    EventSessionsPage.nextButton.click();
    checkRecurringEventDetails(Booking);
  });

  it('should show the proper event details for non recurring event', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    expect(EventDobVerificationPage.verifyAgeMessage.getText()).to.equal('Please verify your age');
    expect(EventDobVerificationPage.dobInputLabel.getText()).to.equal('Enter your Date of Birth');
    checkEventDetails(EventDobVerificationPage);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    checkEventDetails(EventSessionsPage);
    EventSessionsPage.ticketCounterIncrement(1).click();
    EventSessionsPage.ticketCounterIncrement(4).click();
    EventSessionsPage.ticketCounterIncrement(4).click();

    EventSessionsPage.nextButton.click();

    checkEventDetails(Booking);
  });

  it('should show the event name in the header', ()=>{
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    checkHeaderContent(EventDobVerificationPage);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    checkHeaderContent(EventSessionsPage);

    EventSessionsPage.ticketCounterIncrement(1).click();
    EventSessionsPage.ticketCounterIncrement(4).click();
    EventSessionsPage.ticketCounterIncrement(4).click();
    EventSessionsPage.nextButton.click();

    checkHeaderContent(Booking);
  });

  it('should not show parent tickets for a youth over 13', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned13.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned13.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned13.getFullYear());

    EventDobVerificationPage.verify.click();

    expect(EventSessionsPage.eventSessions(0).getText()).not.contains('Parent');
    expect(EventSessionsPage.eventSessions(1).getText()).not.contains('Parent');
  });

  it('should show parent tickets for someone over 18', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned18 = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned18.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned18.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned18.getFullYear());

    EventDobVerificationPage.verify.click();

    expect(EventSessionsPage.eventSessions(0).getText()).contains('Parent');
    expect(EventSessionsPage.eventSessions(1).getText()).contains('Parent');
  });

  it('should allow modifying of selected tickets after they have been selected', () => {
    startBooking();
    Booking.modifyButton.click();
    EventSessionsPage.sessionsHeader.waitForVisible();
  });
});
