import homePage from '../../pages/home';

describe('Dashboard news', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/wp-json/wp/v2/posts?per_page=6', 'fx:blogArticles').as('blogArticles');
  });

  it('should display the news area', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@blogArticles');
    cy.get(homePage.newsTitle).invoke('text').should('eq', 'News Updates');
  });
  
  it('should display the latest 6 news', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@blogArticles');
    cy.get(homePage.newsEntries).should('have.length', 6);
  });

  it('should display its category, its date and its title', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@blogArticles');
    cy.get(homePage.newsEntries).first()
      .within((el) => {
        cy.get(homePage.newsEntryTitle).invoke('text').should('eq', 'What we discussed on the July Open Community Call');
        cy.get(homePage.newsEntryDate).invoke('text').should('eq', '09/08/2018');
        cy.get(homePage.newsEntryCategory).invoke('text').should('eq', 'News');
      });
  });
  it('should display the oldest as last', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@blogArticles');
    cy.get(homePage.newsEntries).last()
      .within((el) => {
        cy.get(homePage.newsEntryDate).invoke('text').should('eq', '17/07/2018');
      });
  });
});
