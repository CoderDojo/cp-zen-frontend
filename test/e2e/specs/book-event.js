const Booking = require('../page-objects/booking');
const BookingConfirmation = require('../page-objects/booking-confirmation');
const DojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDobVerificationPage = require('../page-objects/event-dob-verification');
const EventSessionsPage = require('../page-objects/event-sessions');
const currentYear = (new Date()).getFullYear();

function checkHeaderContent(page) {
  expect(page.bookEventTitle.getText()).to.equal('Book Event');
  expect(page.eventTitle.getText()).to.equal('My First Amazing Event');
}

function checkEventDetails(page) {
  page.sectionIcons[0].waitForVisible();
  expect(page.sectionHeaders[0].getText()).to.equal('TIME');
  expect(page.sectionContents[0].getText()).to.have.string(`September 6, ${currentYear + 1}`);
  expect(page.sectionContents[0].getText()).to.have.string('4:30pm - 6pm');
  page.sectionIcons[1].waitForVisible();
  expect(page.sectionHeaders[1].getText()).to.equal('LOCATION');
  expect(page.sectionContents[1].getText()).to.equal('CHQ, Dublin, Ireland');
  // NOTE : this is wrong, but getText doesn't seem to grab the content of sub-nodes, while it should
  expect(page.sectionContents[2].getText()).to.equal('Join us for our second session back in the autumn term!\nNew beginners will be building games and creating projects using Scratch a visual programming language. Returning ninjas will working on more advanced content so come with your thinking hats and be ready to solve some advanced problems!    : Doors open at 5:50 pm attendees will not be able to enter Dogpatch Labs before this. \n\n  Parents are asked to help get their child set up, laptops turned on etc so mentors can focus on mentoring.\nRead full event details');
}

function checkRecurringEventDetails(page) {
  page.sectionIcons[0].waitForVisible();
  expect(page.sectionHeaders[0].getText()).to.equal('TIME');
  expect(page.sectionContents[0].getText()).to.have.string('Next in series: June 3, 2018');
  expect(page.sectionContents[0].getText()).to.have.string('10am - 12pm');
  expect(page.sectionContents[0].getText()).to.have.string('Every two weeks on Sunday');
  page.sectionIcons[1].waitForVisible();
  expect(page.sectionHeaders[1].getText()).to.equal('LOCATION');
  expect(page.sectionContents[1].getText()).to.equal('CHQ, Dublin, Ireland');
  // NOTE : this is wrong, but getText doesn't seem to grab the content of sub-nodes, while it should
  expect(page.sectionContents[2].getText()).to.equal('Join us for our second session back in the autumn term!\nNew beginners will be building games and creating projects using Scratch a visual programming language. Returning ninjas will working on more advanced content so come with your thinking hats and be ready to solve some advanced problems!    : Doors open at 5:50 pm attendees will not be able to enter Dogpatch Labs before this. \n\n  Parents are asked to help get their child set up, laptops turned on etc so mentors can focus on mentoring.\nRead full event details');
}

function startBooking() {
  DojoPage.openDojoWithQuery('dublin');
  DojoDetailsPage.name.waitForVisible();
  DojoDetailsPage.firstEventViewButton.waitForVisible();
  DojoDetailsPage.eventViewButtons[0].click();

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
  expect(Booking.dateOfBirthDayInput.getValue()).to.equal('27');
  expect(Booking.dateOfBirthMonthInput.getValue()).to.equal('3');
  expect(Booking.dateOfBirthYearInput.getValue()).to.equal('1980');
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
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe@example.com');

    expect(Booking.attendeeTypeHeader[1].getText()).to.equal('Laptop required (Arduino)');
    expect(Booking.sessionTicketNotes[0]).to.equal('N/A');
    Booking.sessionTicketFirstName[0].setValue('Child');
    Booking.sessionTicketLastName[0].setValue('One');
    Booking.sessionTicketDayOfBirth(0).selectByValue('1');
    Booking.sessionTicketMonthOfBirth(0).selectByValue('0');
    Booking.sessionTicketYearOfBirth(0).selectByValue('2008');
    Booking.sessionTicketGender('Male')[0].click();
    Booking.sessionTicketNotes[0].setValue('Bananas');

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

    // Requesting approval event
    expect(BookingConfirmation.bookingConfirmationMessage.getText()).to.equal('Booking Request Sent');
    expect(BookingConfirmation.emailMessage.getText()).to.equal('You will be notified when the organizer approves your request.');

    expect(BookingConfirmation.eventName.getText()).to.equal('My First Amazing Event');
    expect(BookingConfirmation.hostedByMessage.getText()).to.equal('Event hosted by Dublin Ninja Kids');

    expect(BookingConfirmation.detailsBoxTitle(0).getText()).to.equal('TIME');
    expect(BookingConfirmation.eventDate.getText()).to.equal(`September 6, ${currentYear + 1}`);
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
    expect(BookingConfirmation.accountCreationConfirmation.$('a').getAttribute('href')).to.match(/\/dashboard\/my-dojos$/);
    expect(BookingConfirmation.joinedDojoConfirmation.getText()).to.equal('You are now subscribed to Dublin Ninja Kids dojo\nYou will be notified about future events hosted by this dojo');
    expect(BookingConfirmation.approvalRequiredMessage.getText()).to.equal('Your tickets are now awaiting approval\nYou will be notified when the organizer approves your request.');

    expect(BookingConfirmation.eventDetailsHeader.getText()).to.equal('Event Details');
    expect(BookingConfirmation.eventDescription.getText()).to.equal('Join us for our second session back in the autumn term!\nNew beginners will be building games and creating projects using Scratch a visual programming language. Returning ninjas will working on more advanced content so come with your thinking hats and be ready to solve some advanced problems!    Note: Doors open at 5:50 pm attendees will not be able to enter Dogpatch Labs before this. \n\nAll ninjas should: \nBook a ticket\nBring a laptop (there are limited laptops available). \nBring an Android Phone/Tablet (if they have one & are using App Inventor)\nBe accompanied by a parent/guardian at all times. \nParents are asked to help get their child set up, laptops turned on etc so mentors can focus on mentoring.');

    const hostedByLink = BookingConfirmation.hostedByMessage.$('a');
    hostedByLink.scroll(0, -200);
    hostedByLink.click();
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.name.getText()).to.equal('Dublin Ninja Kids');
  });

  it('should show youth email input field when youth is booking', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

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

  it.only('should prefill youth dob field from verification when youth is booking', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned13.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned13.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned13.getFullYear());
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(0).click();
    EventSessionsPage.nextButton.click();

    Booking.firstName.waitForVisible();

    expect(Booking.sessionTicketDayOfBirth(0).getValue()).to.equal(`${turned13.getDate()}`);
    expect(Booking.sessionTicketMonthOfBirth(0).getValue()).to.equal(`${turned13.getMonth()}`);
    expect(Booking.sessionTicketYearOfBirth(0).getValue()).to.equal(`${turned13.getFullYear()}`);
  });

  it('should not show youth email input field when parent is booking', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

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
    Booking.phoneNumber.setValue('+1-555-12-3456');
    Booking.email.setValue('john.doe@example.com');
    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.phoneNumberValidationError[1].getText()).to.equal('Phone number is invalid');
  });

  it('should report validation errors for invalid email', () => {
    startBooking();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
    Booking.phoneNumber.setValue('1555123456');
    Booking.email.setValue('john.doe');
    browser.pause(2000);
    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.emailValidationError[1].getText()).to.equal('Parent email address is invalid');
  });

  it('should report validation errors missing required fields', () => {
    startBooking();

    Booking.checkRecaptcha();

    Booking.submitBookingButton.waitForVisible();
    Booking.submitBookingButton.click();

    expect(Booking.firstNameValidationError.getText()).to.equal('First name is required');
    expect(Booking.lastNameValidationError.getText()).to.equal('Last name is required');
    expect(Booking.emailValidationError[0].getText()).to.equal('Parent email address is required');
    expect(Booking.phoneNumberValidationError[0].getText()).to.equal('Phone number is required');

    [0, 1].forEach((i) => {
      expect(Booking.sessionTicketFirstNameValidationError[i].getText()).to.equal('First name is required');
      expect(Booking.sessionTicketLastNameValidationError[i].getText()).to.equal('Last name is required');
      expect(Booking.sessionTicketDateOfBirthValidationError[i].getText()).to.equal('Date of birth is required');
    });
  });

  it('should show the proper event details for recurring event', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[1].click();

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
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

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

  it('should show the event name in the header', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

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
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    const now = new Date();
    const turned13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned13.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned13.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned13.getFullYear());

    EventDobVerificationPage.verify.click();

    expect(EventSessionsPage.eventSessions[0].getText()).not.contains('Parent');
    expect(EventSessionsPage.eventSessions[1].getText()).not.contains('Parent');
  });

  it('should show parent tickets for someone over 18', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    const now = new Date();
    const turned18 = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate(), 0, 0, 0, 0);

    EventDobVerificationPage.dateOfBirthDayInput.waitForVisible();
    EventDobVerificationPage.dateOfBirthDayInput.selectByValue(turned18.getDate());
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue(turned18.getMonth());
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue(turned18.getFullYear());

    EventDobVerificationPage.verify.click();

    expect(EventSessionsPage.eventSessions[0].getText()).contains('Parent');
    expect(EventSessionsPage.eventSessions[1].getText()).contains('Parent');
  });

  it('should allow modifying of selected tickets after they have been selected', () => {
    startBooking();
    Booking.modifyButton.click();
    EventSessionsPage.sessionsHeader.waitForVisible();
  });

  it('should not allow the user to continue in the booking flow when the event is full', () => {
    DojoPage.openDojoWithQuery('dublin', 1);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons[0].getText()).equals('FULL');
    expect(DojoDetailsPage.eventViewButtons[0].isEnabled()).equals(false);
  });

  it('should show recurring frequency on confirmation page for recurring event', () => {
    DojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[1].click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    EventSessionsPage.ticketCounterIncrement(4).click();

    EventSessionsPage.nextButton.click();

    Booking.firstName.setValue('John');
    Booking.lastName.setValue('Doe');
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
    expect(BookingConfirmation.recurringFrequencyInfo.getText()).to.equal('Every two weeks on Sunday');
  });

  it('should require preferred gender if "Not listed" is selected', () => {
    startBooking();

    Booking.sessionTicketGender('Other')[0].click();
    Booking.checkRecaptcha();
    Booking.submitBookingButton.click();

    expect(Booking.sessionOtherGenderValidationError[0].isVisible()).to.equal(true);
    expect(Booking.sessionOtherGenderValidationError[0].getText()).to.equal('Preferred gender is required');
  });

  it('should not require preferred gender if "Not listed" is not selected', () => {
    startBooking();

    Booking.sessionTicketGender('Female')[0].click();
    Booking.checkRecaptcha();
    Booking.submitBookingButton.click();

    expect(Booking.sessionOtherGenderValidationError[0].isVisible()).to.equal(false);
  });
});
