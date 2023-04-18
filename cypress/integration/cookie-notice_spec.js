import basePage from '../pages/base';
import findDojoPage from '../pages/find-dojo';
import dojoDetailsPage from '../pages/dojo-details';

describe('Cookie Notice', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:loggedOutUser');
    cy.route('/api/2.0/ip-country-details', 'fx:ip-country-details/ie');
    cy.fixture('dojos').then(((dojos) => {
      cy.route('POST', '/api/2.0/dojos/search-bounding-box', dojos);
      cy.route('POST', '/api/2.0/dojos', dojos[0]);
    }));
    // cy.route('POST', '/api/2.0/dojos', 'fx:dojos').as('findDojos');
  });

  it('should disappear after navigating from first page, and persist', () => {
    cy.visit('/');
    cy.get(basePage.cookieNoticeDismiss).should('be.visible');
    cy.get(findDojoPage.addressSearchInput).type('dublin');
    cy.get(findDojoPage.addressSearchButton).click();
    cy.get(findDojoPage.dojoLinks).eq(0).click();
    // cy.wait('@findDojos');
    cy.get(dojoDetailsPage.name, {
      timeout: 5000
    }).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
    cy.reload();

    cy.get(dojoDetailsPage.name).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
  });

  it('should disappear after dismissing from first page, and persist', () => {
    cy.visit('/');
    cy.get(basePage.cookieNoticeDismiss).should('be.visible').click();
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
    cy.reload();
    cy.get(findDojoPage.header).should('be.visible');
    cy.get(basePage.cookieNoticeDismiss).should('not.be.visible');
  });
});
