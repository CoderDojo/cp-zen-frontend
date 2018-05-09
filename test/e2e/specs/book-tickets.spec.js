
const Booking = require('../page-objects/booking');
const BookingConfirmation = require('../page-objects/booking-confirmation');
const DojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDobVerificationPage = require('../page-objects/event-dob-verification');
const EventSessionsPage = require('../page-objects/event-sessions');
const LoginPage = require('../page-objects/login');
const currentYear = new Date().getFullYear();
const o13Year = (new Date()).setFullYear(currentYear - 14)
const u13Year = (new Date()).setFullYear(currentYear - 10);

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
      expect(EventDobVerificationPage.verifyAgeMessage.getText()).to.equal('Please verify your age');
      expect(EventDobVerificationPage.dobInputLabel.getText()).to.equal('Enter your Date of Birth');

      EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
      EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
      EventDobVerificationPage.dateOfBirthYearInput.selectByValue(new Date(u13Year).getFullYear());
      EventDobVerificationPage.verify.click();
      expect(EventDobVerificationPage.dateOfBirthError.isVisible()).to.be.true;
      expect(EventDobVerificationPage.dateOfBirthError.getText()).to.equal('You will need your parent to carry out the registration.');
    });
    it.skip('should display an error invalid email');
  });
  describe('FTB', () => {
    describe('when single', () => {
      it.skip('should let me login')
      it.skip('should let me register as an o13', () => {

      });
      describe('logged-in', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('child1o13@example.com');
          LoginPage.password.setValue('testchild1o13');
          LoginPage.login.click();
          // TODO : replace with startBooking once it's bypassing user creation
          browser.url('/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
          Booking.eventTitle.waitForVisible();
        });
        it('should display an individual ticket without options to add children', () => {
          expect(Booking.allTickets().length).to.equal(1);
          expect(Booking.addYouthButton.isVisible()).to.be.false;
        });
        it('should not display the phone number', () => {
          expect(Booking.phoneNumber.isVisible()).to.be.false;
        });
        it('should let me select tickets for ninjas', () => {
          expect(Booking.ticketName(0).getText()).to.equal('Name:child 1o13');
          expect(Booking.ticketSelector(0).isVisible()).to.be.true;
        });
      });
      afterEach(() => browser.deleteCookie('seneca-login'));
    });
    describe('when parent', () => {
      it.skip('should let me login')
      it.skip('should let me register as an adult', () => {

      });
      describe('logged-in', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('parent1@example.com');
          LoginPage.password.setValue('test');
          LoginPage.login.click();
          // TODO : replace with startBooking once it's bypassing user creation
          browser.url('/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
          Booking.eventTitle.waitForVisible();
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
        it('should let me fill the new user form', () => {
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
        afterEach(() => {
          browser.deleteCookie('seneca-login');
        });
      });
      afterEach(() => browser.deleteCookie('seneca-login'));
    });
  });
  describe('RBF', () => {
    describe('when single', () => {
      describe('when o13', () => {
        // Same as FTB; minus login/reg
      });
      describe('when mentor', () => {
        beforeEach(() => {
          LoginPage.open();
          LoginPage.email.waitForVisible();
          LoginPage.email.setValue('mentor1@example.com');
          LoginPage.password.setValue('test');
          LoginPage.login.click();
          browser.url('/v2/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
          Booking.eventTitle.waitForVisible();
        });
        it('should show a mentor ticket', () => {
          expect(Booking.ticketName(0).getText()).to.equal('Name:mentor one');
        });
        it('should let me add a child', () => {
          expect(Booking.addYouthButton.isVisible()).to.be.true;
        });
        it('should have the children creation closed by default', () => {
          expect(Booking.childrenTickets.length).to.equal(0);
        }); 
        afterEach(() => {
          browser.deleteCookie('seneca-login');
        });
      });
      describe('when adult', () => {
        it('should display an option to add children, none open by default', () => {
          //should not display individual ticket 
        });
      });
    });
    describe('when parent', () => {
      it('should display as many indiviual tickets as many existing kids')
      it('should let me create new children')
    });
  });
});
