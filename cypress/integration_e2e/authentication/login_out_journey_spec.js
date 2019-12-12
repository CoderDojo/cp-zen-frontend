import page from '../../pages/login';
import homePage from '../../pages/home';

describe('Login & out Smoke', () => {
  describe('Successful Login & out', () => {
    it('should login successfully without a referrer query param', () => {
      cy.visit('/login');
      cy.get(page.email).type('testmail+user00013b8e-f370-4702-bb0f-647c90e941c3@example.com');
      cy.get(page.password).type('test');
      cy.get(page.login).click();

      cy.url().should('include', '/home');
      cy.get(homePage.menuUserName).first().invoke('text').should('eq', 'Namey McNameFace');
    });

    it('should login successfully with a referrer query param', () => {
      cy.visit('/login?referrer=%2Fdashboard%2Ftickets');
      cy.get(page.email).type('testmail+user00013b8e-f370-4702-bb0f-647c90e941c3@example.com');
      cy.get(page.password).type('test');
      cy.get(page.login).click();

      cy.url().should('include', '/dashboard/tickets');
      cy.get(homePage.menuUserName).first().invoke('text').should('eq', 'Namey McNameFace');
    });

    it('should logout successfully', () => {
      cy.visit('/login');
      cy.get(page.email).type('testmail+user00013b8e-f370-4702-bb0f-647c90e941c3@example.com');
      cy.get(page.password).type('test');
      cy.get(page.login).click();

      cy.url().should('include', '/home');
      cy.get(homePage.menuUserName).first().click();
      cy.get(homePage.menuLogout).first().click();

      cy.get(homePage.menuUserName).should('not.be.visible');
    });
  });
});

