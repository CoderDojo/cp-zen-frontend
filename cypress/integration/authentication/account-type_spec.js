import page from '../../pages/account-type';

const mockState = 'mock-state';

describe('Account Type Page', () => {
  describe('Form Validation', () => {
    beforeEach(() => {
      cy.server();
      cy.route('/api/2.0/users/instance', 'fx:loggedOutUser');
      cy.route('/locale/languages', [{ name: 'en', code: 'en_US' }]);
      cy.visit(`/account-type?state=${mockState}`);
    });

    it('should show the header, login box, and all login box elements', () => {
      cy.get(page.header).should('be.visible');
      cy.get(page.subHeader).should('be.visible');
      cy.get(page.box).should('be.visible');
      cy.get(page.attendeeChoice).should('be.visible');
      cy.get(page.attendeeChoiceLabel).should('be.visible');
      cy.get(page.guardianChoice).should('be.visible');
      cy.get(page.guardianChoiceLabel).should('be.visible');
      cy.get(page.submitButton).should('be.visible');
    });

    it('should have disabled submit button', () => {
      cy.get(page.submitButton).should('be.disabled');
    });

    it('should enable submit button after choice made', () => {
      cy.get(page.attendeeChoice).click();
      cy.get(page.submitButton).should('not.be.disabled');
    });

    it('on submit should redirect to /rpi/cb with state and choice query params', () => {
      cy.get(page.guardianChoice).click();
      cy.get(page.submitButton).click();
      cy.location('pathname').should('eq', '/rpi/cb');
      cy.location('search').should('eq', '?state=mock-state&type=guardian');
    });
  });
});
