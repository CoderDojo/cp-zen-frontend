import basePage from '../pages/base';
import findDojoPage from '../pages/find-dojo';
import dojoDetailsPage from '../pages/dojo-details';

describe('Cookie Notice', () => {
  it('should disappear after navigating from first page, and persist', () => {
    cy.visit('/');
    cy.get(basePage.cookieNoticeDismiss).should('be.visible');
    cy.get(findDojoPage.addressSearchInput).type('dublin');
    cy.get(findDojoPage.addressSearchButton).click();
    cy.get(findDojoPage.dojoLinks).eq(0).click();
    cy.get(dojoDetailsPage.name).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
    cy.reload();
    cy.get(dojoDetailsPage.name).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
  });

  it('should disappear after navigating from first page, and persist', () => {
    cy.visit('/');
    cy.get(basePage.cookieNoticeDismiss).should('be.visible').click();
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
    cy.reload();
    cy.get(findDojoPage.header).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
  });
});
