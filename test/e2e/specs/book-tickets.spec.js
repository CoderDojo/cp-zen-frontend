
const Booking = require('../page-objects/booking');
const BookingConfirmation = require('../page-objects/booking-confirmation');
const DojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventAccountCreation = require('../page-objects/event-register-or-login');
const EventSessionsPage = require('../page-objects/event-sessions');
const LoginPage = require('../page-objects/login');
const currentYear = new Date().getFullYear();
const o13Year = (new Date()).setFullYear(currentYear - 14)
const u13Year = (new Date()).setFullYear(currentYear - 10);
const adultYear = (new Date()).setFullYear(currentYear - 20);

function startBooking() {
  DojoPage.openDojoWithQuery('dublin');
  DojoDetailsPage.name.waitForVisible();
  DojoDetailsPage.firstEventViewButton.waitForVisible();
  DojoDetailsPage.eventViewButtons[0].click();
}

describe('Book event page', () => {
  describe('Register page', () => {
    it('should display an error if underage', () => {
      startBooking();
      expect(EventAccountCreation.dobInputLabel.getText()).to.equal('Enter your Date of Birth');
      EventAccountCreation.dateOfBirthDayInput.selectByValue('27');
      EventAccountCreation.dateOfBirthMonthInput.selectByValue('3');
      EventAccountCreation.dateOfBirthYearInput.selectByValue(new Date(u13Year).getFullYear());
      EventAccountCreation.checkRecaptcha();
      EventAccountCreation.verify.click();
      expect(EventAccountCreation.dateOfBirthError.isVisible()).to.be.true;
      expect(EventAccountCreation.dateOfBirthError.getText()).to.equal('Sorry :( Children under 13 are note allowed to book events. You can ask your parent or guardian to bookfor you.');
    });
    it('should display an error invalid email', () => {
      startBooking();
      EventAccountCreation.checkRecaptcha();
      EventAccountCreation.verify.click();
      expect(EventAccountCreation.emailValidationError[0].getText()).to.equal('Parent email address is required');
      EventAccountCreation.email.setValue('banana');
      expect(EventAccountCreation.emailValidationError[1].getText()).to.equal('Parent email address is invalid');
    });
  });
  describe('FTB', () => {
    describe('when single', () => {
      it('should let me login and redirect', () => {
        startBooking();
        EventAccountCreation.redirectToLogin.waitForVisible();
        EventAccountCreation.redirectToLogin.click();
        LoginPage.email.waitForVisible();
        LoginPage.email.setValue('child1o13@example.com');
        LoginPage.password.setValue('testchild1o13');
        LoginPage.login.click();
        Booking.eventTitle.waitForVisible();
        expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
      });
      it('should let me register as an o13', () => {
        startBooking();
        EventAccountCreation.dateOfBirthDayInput.selectByValue('27');
        EventAccountCreation.dateOfBirthMonthInput.selectByValue('3');
        EventAccountCreation.dateOfBirthYearInput.selectByValue(new Date(o13Year).getFullYear());
        EventAccountCreation.email.setValue('child2o13@example.com');
        EventAccountCreation.firstName.setValue('child');
        EventAccountCreation.lastName.setValue('2o13');
        EventAccountCreation.password.setValue('dubidou1234');
        EventAccountCreation.checkRecaptcha();
        EventAccountCreation.termsAndCond.click();
        EventAccountCreation.verify.click();
        Booking.eventTitle.waitForVisible();
        browser.waitUntil(() => browser.getUrl() === 'http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
      });
      describe('logged-in', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('child1o13@example.com');
          LoginPage.password.setValue('testchild1o13');
          LoginPage.login.click();
          startBooking();
          Booking.eventTitle.waitForVisible();
        });
        it('should bypass the registration display', () => {
          expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        });
        it('should display an individual ticket without options to add children', () => {
          expect(Booking.tickets.length).to.equal(1);
          expect(Booking.addYouthButton.isVisible()).to.be.false;
        });
        it('should not display the phone number', () => {
          expect(Booking.phoneNumber.isVisible()).to.be.false;
        });
        it('should let me select tickets for ninjas', () => {
          browser.waitUntil(() => Booking.tickets.length > 0);
          expect(Booking.ticketName(0).getText()).to.equal('Name:\nchild 1o13');
          expect(Booking.ticketSelector(0).isVisible()).to.be.true;
        });
      });
      // Mentor cannot book on FTB as they need to be accepted first
      afterEach(() => {
        browser.deleteCookie('seneca-login');
        browser.deleteCookie('loggedIn');
      });
    });
    describe('when parent', () => {
      it('should let me login', () => {
        startBooking();
        EventAccountCreation.redirectToLogin.click();
        LoginPage.email.waitForVisible();
        LoginPage.email.setValue('parent1@example.com');
        LoginPage.password.setValue('test');
        LoginPage.login.click();
        Booking.eventTitle.waitForVisible();
        expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
      });
      it('should let me register as an adult', () => {
        startBooking();
        EventAccountCreation.dateOfBirthDayInput.selectByValue('27');
        EventAccountCreation.dateOfBirthMonthInput.selectByValue('3');
        EventAccountCreation.dateOfBirthYearInput.selectByValue(new Date(adultYear).getFullYear());
        EventAccountCreation.email.setValue('parent42@example.com');
        EventAccountCreation.firstName.setValue('parent');
        EventAccountCreation.lastName.setValue('forty-six and two');
        EventAccountCreation.password.setValue('>>><<<<and2');
        EventAccountCreation.checkRecaptcha();
        EventAccountCreation.termsAndCond.click();
        EventAccountCreation.verify.click();
        Booking.eventTitle.waitForVisible();
        browser.waitUntil(() => browser.getUrl() === 'http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
      });
      describe('pre-logged-in', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('parent1@example.com');
          LoginPage.password.setValue('test');
          LoginPage.login.click();
          startBooking();
          Booking.eventTitle.waitForVisible();
        });
        it('should bypass the registration display', () => {
          expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        });
        it('should display an option to add children, with 1 by default open', () => {
          expect(Booking.ticketName(0)).to.be.undefined;
          expect(Booking.childTicketTitle.length).to.equal(1);
          expect(Booking.childTicketTitle[0].isVisible()).to.be.true;
          expect(Booking.childTicketTitle[0].getText()).to.equal('Ticket');
          expect(Booking.addYouthButton.isVisible()).to.be.true;
        });
        it('should let me select tickets for ninjas')
        it('should let me add new tickets', () => {
          expect(Booking.ticketName(0)).to.be.undefined;
          expect(Booking.childTicketTitle.length).to.equal(1);
          Booking.addYouthButton.click();
          expect(Booking.childTicketTitle.length).to.equal(2);
        });
        it('should stop me from booking a ticket that has no space for me', () => {
          browser.url('http://localhost:8080/v2/events/34174952-8ca4-4189-b8cb-d383e3fde992/sessions');
          Booking.eventTitle.waitForVisible();
          const ticket = Booking.childTicketSelector('With Pi [Fully booked]')[0];
          ticket.waitForVisible();
          expect(ticket.isVisible()).to.be.true;
        });
        it('should stop me from booking an event that has no space', () => {
          browser.url('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1a/sessions');
          Booking.eventIsFullEmoji.waitForVisible();
          expect(Booking.ticketName(0)).to.be.undefined;
          expect(Booking.eventIsFullEmoji.isVisible()).to.be.true; 
          expect(Booking.eventIsFullHeader.isVisible()).to.be.true; 
          expect(Booking.eventIsFullSubheader.isVisible()).to.be.true;
        });
        it('should stop me from booking a ticket that has less than the sum of possible tickets', () => {
          browser.url('http://localhost:8080/v2/events/34174952-8ca4-4189-b8cb-d383e3fde992/sessions');
          Booking.eventTitle.waitForVisible();
          Booking.childTicketSelector('Lacking Pi')[0].click()
          Booking.addYouthButton.click();
          const ticket = Booking.childTicketSelector('Lacking Pi [Fully booked]')[0];
          ticket.waitForVisible();
          expect(ticket.isVisible()).to.be.true;
        });
        it('should let me fill the new user form', () => {
          browser.waitUntil(() => Booking.childrenTickets.length > 0);
          Booking.childTicketFirstName[0].setValue('Babar');
          expect(Booking.childTicketTitle[0].getText()).to.equal('Ticket - Babar');
          // TODO
        });
        it('should validate on submit', () => {
          Booking.submitBookingButton.click();
          expect(Booking.childTicketFirstNameValidationError.isVisible()).to.be.true;
          expect(Booking.childTicketLastNameValidationError.isVisible()).to.be.true;
          expect(Booking.childTicketDateOfBirthValidationError.isVisible()).to.be.true;
          expect(Booking.childTicketGenderValidationError.isVisible()).to.be.true;
          expect(Booking.childTicketSelectorValidationError.isVisible()).to.be.true;
          expect(Booking.phoneNumberValidationError.isVisible()).to.be.true;
        });
        it('should not send a deleted child', () => {
          // Fill first kid
          Booking.childTicketFirstName[0].waitForVisible();
          Booking.childTicketFirstName[0].setValue('Babar');
          Booking.childTicketLastName[0].setValue('Le roi des ephelants');
          Booking.childTicketDayOfBirth(0).selectByValue(20);
          Booking.childTicketMonthOfBirth(0).selectByValue(1);
          Booking.childTicketYearOfBirth(0).selectByValue(2002);
          Booking.childTicketGender(0).selectByValue('male');
          Booking.childTicketSelector('Laptop required')[0].click();
          // Fill 2nd kid
          Booking.addYouthButton.click();
          Booking.childTicketFirstName[1].waitForVisible();
          Booking.childTicketFirstName[1].setValue('Babou');
          Booking.childTicketLastName[1].setValue('Le roi des riens');
          Booking.childTicketDayOfBirth(1).selectByValue(20);
          Booking.childTicketMonthOfBirth(1).selectByValue(1);
          Booking.childTicketYearOfBirth(1).selectByValue(2002);
          Booking.childTicketGender(1).selectByValue('female');
          
          Booking.childTicketSelector('Bringing a laptop', 1)[3].click();
          Booking.removeChildTicket[1].click();
          Booking.phoneNumber.setValue('+0');
          Booking.submitBookingButton.click();
          BookingConfirmation.eventName.waitForVisible();
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
          expect(BookingConfirmation.bookingName(0).getText()).to.equal('Babar Le roi des ephelants');
          expect(BookingConfirmation.bookingSessionTicket(0).getText()).to.equal('Laptop required / Arduino');
          expect(BookingConfirmation.bookingName(1).getText()).to.equal('parent 1one');
          expect(BookingConfirmation.bookingSessionTicket(1).getText()).to.equal('Parent / Arduino');

        })
        it('should display the confirmation page', () => {
          Booking.childTicketFirstName[0].waitForVisible();
          Booking.childTicketFirstName[0].setValue('Babar');
          Booking.childTicketLastName[0].setValue('Le roi des ephelants');
          Booking.childTicketDayOfBirth(0).selectByValue(20);
          Booking.childTicketMonthOfBirth(0).selectByValue(1);
          Booking.childTicketYearOfBirth(0).selectByValue(2002);
          Booking.childTicketGender(0).selectByValue('male');
          Booking.childTicketSelector('Laptop required')[0].click();
          Booking.phoneNumber.setValue('+0');
          Booking.submitBookingButton.click();
          BookingConfirmation.eventName.waitForVisible();
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
          expect(BookingConfirmation.bookingName(0).getText()).to.equal('Babar Le roi des ephelants');
          expect(BookingConfirmation.bookingSessionTicket(0).getText()).to.equal('Laptop required / Arduino');
          expect(BookingConfirmation.bookingName(1).getText()).to.equal('parent 1one');
          expect(BookingConfirmation.bookingSessionTicket(1).getText()).to.equal('Parent / Arduino');

          expect(BookingConfirmation.accountCreationConfirmation.isVisible()).to.be.false;
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
      });
      afterEach(() => {
        browser.deleteCookie('seneca-login');
        browser.deleteCookie('loggedIn');
      });
    });
  });
  describe('RBF', () => {
    describe('when single', () => {
      describe('when o13', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('child1o13@example.com');
          LoginPage.password.setValue('testchild1o13');
          LoginPage.login.click();
          startBooking();
          Booking.eventTitle.waitForVisible();
        });
        it('should bypass the registration display', () => {
          expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        });
        it('should display an individual ticket without options to add children', () => {
          expect(Booking.tickets.length).to.equal(1);
          expect(Booking.addYouthButton.isVisible()).to.be.false;
        });
        it('should not display the phone number', () => {
          expect(Booking.phoneNumber.isVisible()).to.be.false;
        });
        it('should let me select tickets for ninjas', () => {
          expect(Booking.ticketName(0).getText()).to.equal('Name:\nchild 1o13');
          expect(Booking.ticketSelector(0).isVisible()).to.be.true;
        });
      });
      describe('when mentor', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('mentor1@example.com');
          LoginPage.password.setValue('test');
          LoginPage.login.click();
          startBooking();
          Booking.eventTitle.waitForVisible();
        });
        it('should bypass the registration display', () => {
          expect(browser.getUrl()).to.equal('http://localhost:8080/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
        });
        it('should show a mentor ticket', () => {
          browser.waitUntil(() => Booking.tickets.length > 0);
          expect(Booking.ticketName(0).getText()).to.equal('Name:\nmentor one');
        });
        it('should let me add a child', () => {
          Booking.addYouthButton.waitForVisible();
          expect(Booking.addYouthButton.isVisible()).to.be.true;
        });
        it('should have the children creation closed by default', () => {
          expect(Booking.childrenTickets.length).to.equal(0);
        });
        afterEach(() => {
          browser.deleteCookie('seneca-login');
          browser.deleteCookie('loggedIn');
        });
      });
    });
    describe('when parent', () => {
      beforeEach(() => {
        LoginPage.open();
        LoginPage.email.waitForVisible();
        LoginPage.email.setValue('parent3@example.com');
        LoginPage.password.setValue('test');
        LoginPage.login.click();
        startBooking();
        Booking.eventTitle.waitForVisible();
      });
      it('should display as many indiviual tickets as many existing kids', () => {
        browser.waitUntil(() => Booking.tickets.length > 0);
        expect(Booking.ticketName(0).getText()).to.equal('Name:\nchild 3three');
      });
      it('should hide the ticket when not attending is selected', () => {
        browser.waitUntil(() => Booking.tickets.length > 0);
        expect(Booking.ticketName(0).getText()).to.equal('Name:\nchild 3three');
        expect(Booking.notAttendingSelector(0).isVisible()).to.be.true;
        expect(Booking.ticketSelector(0).isVisible()).to.be.true;
        expect(Booking.specialReqSelector(0).isVisible()).to.be.true;
        Booking.notAttendingSelector(0).click();
        expect(Booking.ticketSelector(0)).to.be.undefined;
        expect(Booking.specialReqSelector(0)).to.be.undefined;
      });
      it('should let me create new children', () => {
        expect(Booking.addYouthButton.isVisible()).to.be.true;
      });
      it('should have the children creation closed by default', () => {
        expect(Booking.childrenTickets.length).to.equal(0);
      });
    });
    describe('when adult without kids', () => {
      beforeEach(() => {
        LoginPage.open();
        LoginPage.email.waitForVisible();
        LoginPage.email.setValue('adult1@example.com');
        LoginPage.password.setValue('test');
        LoginPage.login.click();
        startBooking();
        Booking.eventTitle.waitForVisible();
      });
      it('should display no indiviual tickets as it has no kids', () => {
        expect(Booking.tickets.length).to.equal(0);
      });
      it('should let me create new children', () => {
        expect(Booking.addYouthButton.isVisible()).to.be.true;
      });
      it('should have the children creation opened by default', () => {
        expect(Booking.childrenTickets.length).to.equal(1);
      });
    });
  });
  describe('edit booking', () => {
    it('should display no indiviual tickets as it has no kids', () => {
      LoginPage.open();
      LoginPage.email.waitForVisible();
      LoginPage.email.setValue('mentor1@example.com');
      LoginPage.password.setValue('test');
      LoginPage.login.click();
      startBooking();
      // Book a first time
      Booking.eventTitle.waitForVisible();
      Booking.ticketSelector(0).click()
      Booking.ticketOption('Mentor')[0].click()
      Booking.phoneNumber.setValue('+0');
      Booking.submitBookingButton.click();
      // Return to booking
      startBooking();
      Booking.ticketSelected.waitForVisible();
      expect(Booking.ticketSelected.getText()).to.equal('Mentor');
    });
  });
});
