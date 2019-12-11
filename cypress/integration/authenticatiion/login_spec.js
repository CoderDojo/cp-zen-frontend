import page from '../../pages/login';

describe('Login Page', () => {
  it('should show the header, login box , and all login box elements', () => {
    cy.visit('/login');
    cy.get(page.header).should('be.visible');
    cy.get(page.loginBox).should('be.visible');
    cy.get(page.email).should('be.visible');
    cy.get(page.password).should('be.visible');
    cy.get(page.login).should('be.visible');
    cy.get(page.forgotPassword).should('be.visible');
    cy.get(page.register).should('be.visible');
    cy.get(page.forgotPasswordLink).should('have.attr', 'href', '/reset');
    cy.get(page.registerLink).should('have.attr', 'href', '/register');
  });
})