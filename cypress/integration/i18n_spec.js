import basePage from '../pages/base';
import findDojoPage from '../pages/find-dojo';

describe('i18n', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:loggedOutUser');
    cy.route('/api/2.0/ip-country-details', 'fx:ip-country-details/ie');
    cy.route('/locale/languages', 'fx:languages').as('languages');
    cy.route('/locale/data?format=mf&lang=de_DE', 'fx:localesDE').as('translations');
    cy.route('/locale/data?format=mf&lang=en_US', 'fx:localesEN').as('translations');
  });

  it('should change title when language is changed', () => {
    cy.visit('/');
    cy.wait('@languages');
    cy.get(findDojoPage.header).should('have.text', 'Find a Dojo to attend');
    // DE
    cy.get(basePage.languagePicker).select('de_DE');
    cy.wait('@translations');
    cy.get(findDojoPage.header).should('have.text', 'Find a Dojo to attend, but in German');
    // Back to EN
    cy.get(basePage.languagePicker).select('en_US');
    cy.wait('@translations');
    cy.get(findDojoPage.header).should('have.text', 'Find a Dojo to attend');
  });

  it('should keep previously saved language', () => {
    cy.visit('/');
    cy.wait('@languages');
    cy.get(basePage.languagePicker).select('de_DE');
    cy.wait('@translations');
    cy.get(findDojoPage.header).should('have.text', 'Find a Dojo to attend, but in German');
    cy.reload();
    cy.get(basePage.languagePicker).select('de_DE');
    cy.wait('@translations');
    cy.get(findDojoPage.header).should('have.text', 'Find a Dojo to attend, but in German');
  });
});
