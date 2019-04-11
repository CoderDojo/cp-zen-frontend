import page from '../../pages/dojo-details';

describe('Dojos details', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
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
