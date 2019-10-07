import page from '../../pages/dojo-details';

const currentYear = (new Date()).getFullYear();
describe('Dojos details', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/find', 'fx:publicDojo').as('dojo');
    cy.route('/api/3.0/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6/events?**', 'fx:events').as('events')
  });

  it('should show the dojo details', () => {
    cy.visit('/dojos/ie/dublin/cd-rom');
    cy.wait('@loggedIn');
    cy.wait('@dojo');
    cy.get(page.name).should('have.text', 'Dublin Ninja Kids');
    cy.get(page.column.time.content).should('contain.text', 'Third Thursday of the month, 10am - 11:30am');
    cy.get(page.column.location.content).should('contain.text', 'CHQ Building,1 Custom House Quay, North Dock');
    cy.get(page.column.email.content).should('contain.text', 'dublinninjakids@gmail.com');
    cy.get(page.column.website.content).should('contain.text', 'www.dublinninjakids.com');
    cy.get(page.column.social.facebook).invoke('attr', 'href').should('equal', 'https://www.facebook.com/CoderDojo');
    cy.get(page.column.social.twitter).invoke('attr', 'href').should('equal', 'https://twitter.com/CoderDojo');
    cy.get(page.column.social.googleGroup).invoke('attr', 'href').should('equal', 'https://google.group.com/dublinninjakids');
    cy.get(page.map).should('be.visible');
    cy.get(page.details.heading).should('contain.text', 'Details');
    cy.get(page.details.content).should('contain.text', 'This is the Dojo details section');
    cy.get(page.sponsors.heading).should('contain.text', 'Dojo supported by');
    cy.get(page.sponsors.content).should('be.visible');
  });

  it('should show the dojos events', () => {
    cy.visit('/dojos/ie/dublin/cd-rom');
    cy.wait('@dojo');
    cy.wait('@loggedIn');
    cy.wait('@events');
    cy.get(page.events(1).name).should('contain.text', 'My First Amazing Event');
    cy.get(page.events(1).sessions).should('contain.text', 'Sessions: Dojo');
    cy.get(page.events(1).date).should('contain.text', 'July 12, 2019');
    cy.get(page.events(1).time).should('contain.text', '10am - 12pm');
  });

  it('should display the calendar', () => {
    cy.visit('/dojos/ie/dublin/dublin-ninja-kids');
    cy.wait('@loggedIn');
    cy.get(page.column.calendarLink).should('be.visible');
    cy.get(page.column.calendarLink).should('have.text', 'Add to your calendar');
    cy.get(page.column.calendarLink).click();
    cy.get(page.column.calendarInput).should('be.visible');
    cy.get(page.column.calendarCopyBtn).should('be.visible');
    cy.get(page.column.calendarOpenBtn).should('be.visible');
  });
});
