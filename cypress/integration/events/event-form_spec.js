import page from '../../pages/event-form';

describe('Event form', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:cdfAdminLoggedIn');
    cy.route('/api/2.0/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6', 'fx:dojo').as('dojo');
    cy.route('/api/3.0/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6/events?pageSize=1&page=1&orderBy=startTime&direction=desc&related=sessions.tickets', 'fx:events').as('events')
  });

  it('should display the form', () => {
    cy.visit('/dashboard/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6/events/new');
    cy.wait('@dojo');
    cy.wait('@events');
    cy.get(page.header).should('be.visible');
    cy.get(page.submitButton).should('be.visible');
    cy.get(page.submitButton).invoke('text').should('contain', 'Publish');
    cy.get(page.youthTickets).should('be.visible');
    cy.get(page.mentorTickets).should('be.visible');
  });

  it('forwards to dojo page on publish', () => {
    cy.route('POST', '/api/3.0/events', 'fx:events');
    cy.visit('/dashboard/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6/events/new');
    cy.wait('@events');
    cy.wait('@dojo');
    cy.get('[data-cy=title]').type('New event');
    cy.get(page.submitButton).click();
    cy.url().should('include', '/dojos/ie/dublin/cd-rom');
  });

  it('displays error message if form incomplete', () => {
    cy.route('POST', '/api/3.0/events', 'fx:events');
    cy.visit('/dashboard/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6/events/new');
    cy.wait('@events');
    cy.wait('@dojo');
    cy.get(page.submitButton).click();
    cy.get('[data-cy=title-error]').should('be.visible');
    cy.get('[data-cy=title-error]').invoke('text').should('eq', 'Title is required');
  });
});
