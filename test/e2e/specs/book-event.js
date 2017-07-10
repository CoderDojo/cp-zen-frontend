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
  page.sectionIcons[0].waitForVisible();
  expect(page.sectionHeaders[0].getText()).to.equal('TIME');
  expect(page.sectionContents[0].getText()).to.have.string('June 6, 2017');
  expect(page.sectionContents[0].getText()).to.have.string('4:30pm - 6pm');
  page.sectionIcons[1].waitForVisible();
  expect(page.sectionHeaders[1].getText()).to.equal('LOCATION');
  expect(page.sectionContents[1].getText()).to.equal('CHQ, Dublin, Ireland');
}

function checkRecurringEventDetails(page) {
  page.sectionIcons[0].waitForVisible();
  expect(page.sectionHeaders[0].getText()).to.equal('TIME');
  expect(page.sectionContents[0].getText()).to.have.string('Next in series: July 15, 2017');
  expect(page.sectionContents[0].getText()).to.have.string('10am - 12pm');
  expect(page.sectionContents[0].getText()).to.have.string('Every two weeks on Saturdays');
  page.sectionIcons[1].waitForVisible();
  expect(page.sectionHeaders[1].getText()).to.equal('LOCATION');
  expect(page.sectionContents[1].getText()).to.equal('CHQ, Dublin, Ireland');
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
    expect(Booking.tickets(0).getText()).to.have.string('1 x Parent');
    expect(Booking.tickets(0).getText()).to.have.string('Scratch');
    expect(Booking.tickets(1).getText()).to.have.string('2 x Laptop required');
    expect(Booking.tickets(1).getText()).to.have.string('Arduino');

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

    BookingConfirmation.bookingConfirmationMessage.waitForVisible();

    expect(BookingConfirmation.bookingConfirmationMessage.getText()).to.equal('Booking Complete');
    expect(BookingConfirmation.emailMessage.getText()).to.equal('A confirmation email has been sent to john.doe@example.com');

    expect(BookingConfirmation.eventName.getText()).to.equal('My First Amazing Event');
    expect(BookingConfirmation.hostedByMessage.getText()).to.equal('Event hosted by Dublin Ninja Kids');

    expect(BookingConfirmation.detailsBoxTitle(0).getText()).to.equal('TIME');
    expect(BookingConfirmation.eventDate.getText()).to.equal('June 6, 2017');
    expect(BookingConfirmation.eventTimes.getText()).to.equal('4:30pm - 6pm');
    expect(BookingConfirmation.recurringFrequencyInfo.isVisible()).to.equal(false);

    expect(BookingConfirmation.detailsBoxTitle(1).getText()).to.equal('LOCATION');
    expect(BookingConfirmation.eventLocation.getText()).to.equal('CHQ, Dublin, Ireland');

    expect(BookingConfirmation.detailsBoxTitle(2).getText()).to.equal('ATTENDEES');
    expect(BookingConfirmation.bookingName(0).getText()).to.equal('John Doe');
    expect(BookingConfirmation.bookingSessionTicket(0).getText()).to.equal('Parent / Scratch');
    expect(BookingConfirmation.bookingName(1).getText()).to.equal('Child One');
    expect(BookingConfirmation.bookingSessionTicket(1).getText()).to.equal('Laptop required / Arduino');
    expect(BookingConfirmation.bookingName(2).getText()).to.equal('Child Two');
    expect(BookingConfirmation.bookingSessionTicket(2).getText()).to.equal('Laptop required / Arduino');

    expect(BookingConfirmation.accountCreationConfirmation.getText()).to.equal('CoderDojo Account has been created\nYou can log in and find events hosted by this dojo in My Dojos');
    expect(BookingConfirmation.joinedDojoConfirmation.getText()).to.equal('You are now subscribed to Dublin Ninja Kids dojo\nYou will be notified about future events hosted by this dojo');

    expect(BookingConfirmation.eventDetailsHeader.getText()).to.equal('Event Details');
    expect(BookingConfirmation.eventDescription.getText()).to.equal('LEARN ALL THE THINGS');
  });

  it('should show youth email input field when youth is booking', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned13.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned13.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned13.getFullYear());
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(0).click();
    EventSessionsPage.nextButton.click();

    Booking.sessionTicketEmailAddress[0].waitForVisible();
  });

  it('should not show youth email input field when parent is booking', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(0).click();

    const now = new Date();
    const turned20 = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
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

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
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

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
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

  it('should show recurring frequency on confirmation page for recurring event', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons(1).click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(4).click();

    EventSessionsPage.nextButton.click();

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
    Booking.sessionTicketGender('Male')[0].click();

    Booking.password.setValue('Passw0rd');
    Booking.confirmPassword.setValue('Passw0rd');
    Booking.termsAndConditions.click();
    Booking.checkRecaptcha();

    Booking.submitBookingButton.click();

    BookingConfirmation.recurringFrequencyInfo.waitForVisible();
    expect(BookingConfirmation.recurringFrequencyInfo.getText()).to.equal('Every two weeks on Saturdays');
  });
});
