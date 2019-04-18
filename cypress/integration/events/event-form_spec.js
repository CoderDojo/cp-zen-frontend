import page from '../../pages/event-form';

describe('Event form', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn');
    cy.route('/api/2.0/dojos/d1', 'fx:dojo').as('dojo');
  });

  it('should display the form', () => {
    cy.visit('/dashboard/dojos/d1/events/new');
    cy.wait('@dojo');
    cy.get(page.header).should('be.visible');
    cy.get(page.submitButton).should('be.visible');
    cy.get(page.submitButton).invoke('text').should('contain', 'Publish and email members');
    cy.get(page.youthTickets).should('be.visible');
    cy.get(page.mentorTickets).should('be.visible');
  });
});
