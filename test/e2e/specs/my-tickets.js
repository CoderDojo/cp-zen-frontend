const moment = require('moment');
const TicketPage = require('../page-objects/my-tickets');
const LoginPage = require('../page-objects/login');
const currentYear = (new Date()).getFullYear();

describe('My tickets page', () => {
  beforeEach(() => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();
    TicketPage.open();
  });
  it('should show a list of events', () => {
    TicketPage.firstEvent.waitForVisible();
    expect(TicketPage.events.length).to.equal(2);
    expect(TicketPage.eventName(0).getText()).to.equal('My First Amazing Event');
    expect(TicketPage.eventDate(0).getText()).to.equal(`September 6, ${currentYear + 1}`);
    expect(TicketPage.eventTime(0).getText()).to.equal('4:30pm - 6pm');
    // TODO : event2 not booked
    expect(TicketPage.eventName(1).getText()).to.equal('My Second Amazing Event');
    expect(TicketPage.eventDate(1).getText()).to.equal('June 3, 2018');
    expect(TicketPage.eventTime(1).getText()).to.equal('10am - 12pm');
  });

  it('should be booked with 2 tickets and allow cancellation', () => {
    TicketPage.firstEvent.waitForVisible();
    expect(TicketPage.tickets.length).to.equal(2);
    expect(TicketPage.ticketUsername(0).getText()).to.equal('child two');
    expect(TicketPage.ticketName(0).getText()).to.equal('Laptop Required');
    expect(TicketPage.ticketSession(0).getText()).to.equal('Scratch');

    expect(TicketPage.ticketUsername(1).getText()).to.equal('parent two');
    expect(TicketPage.ticketName(1).getText()).to.equal('Parent');
    expect(TicketPage.ticketSession(1).getText()).to.equal('Scratch');

    expect(TicketPage.cancel(0).isVisible()).to.be.true;
    // TODO : fix test once translation supports plurals
    expect(TicketPage.cancel(0).getText()).to.equal('Cancel ticket');
  });

  it('should not be booked and allow booking', () => {
    TicketPage.firstEvent.waitForVisible();
    expect(TicketPage.tickets.length).to.equal(2);
    // Index is 0 because it's the first time it appears, but it's the 2nd event
    expect(TicketPage.book(0).isVisible()).to.be.true;
    expect(TicketPage.ticketStatus(0).getText()).to.equal('No ticket booked');
    expect(TicketPage.book(0).getText()).to.equal('Book');
  });

});
