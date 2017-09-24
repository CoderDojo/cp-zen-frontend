const TicketPage = require('../page-objects/my-tickets');
const LoginPage = require('../page-objects/login');

describe('My tickets page', () => {
  beforeEach(() => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();
    TicketPage.open();
  });
  it('should show a list of events', () => {
    expect(TicketPage.events.length).to.equal(2);
    expect(TicketPage.eventName(0).getText()).to.equal('Docklands Dojo Autumn Term');
    expect(TicketPage.eventDate(0).getText()).to.equal('September 25, 2017');
    expect(TicketPage.eventTime(0).getText()).to.equal('6pm - 7:30pm');
    // TODO : event2 not booked
    expect(TicketPage.eventName(1).getText()).to.equal('Docklands Dojo Winter Term');
    expect(TicketPage.eventDate(1).getText()).to.equal('December 25, 2017');
    expect(TicketPage.eventTime(1).getText()).to.equal('6pm - 7:30pm');
  });

  it('should be booked with 2 tickets and allow cancellation', () => {
    expect(TicketPage.tickets.length).to.equal(2);
    expect(TicketPage.ticketUsername(0).getText()).to.equal('child1 one');
    expect(TicketPage.ticketName(0).getText()).to.equal('ninja');
    expect(TicketPage.ticketSession(0).getText()).to.equal('Tickets');

    expect(TicketPage.ticketUsername(1).getText()).to.equal('parent one');
    expect(TicketPage.ticketName(1).getText()).to.equal('ninja');
    expect(TicketPage.ticketSession(1).getText()).to.equal('Tickets');

    expect(TicketPage.cancel(0).isVisible()).to.be.true;
    // TODO : fix test once translation supports plurals
    expect(TicketPage.cancel(0).getText()).to.equal('Cancel ticket');
  })

  it('should not be booked and allow booking', () => {
    // Index is 0 because it's the first time it appears, but it's the 2nd event
    expect(TicketPage.book(0).isVisible()).to.be.true;
    expect(TicketPage.ticketStatus(0).getText()).to.equal('No ticket booked');
    expect(TicketPage.book(0).getText()).to.equal('Book');
  });

});
