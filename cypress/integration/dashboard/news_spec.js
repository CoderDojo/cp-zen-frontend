import homePage from '../../pages/home';

describe('Dashboard news', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/graphql', 'fx:newsBlogs').as('news');
  });

  it('should display the news area', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@news');
    cy.get(homePage.newsTitle).invoke('text').should('eq', 'News');
  });

  it('should display the latest 6 news', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@news');
    cy.get(homePage.newsEntries).should('have.length', 6);
  });

  it('should display its date and its title', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@news');
    cy.get(homePage.newsEntries).first()
      .within(() => {
        cy.get(homePage.newsEntryTitle).invoke('text').should('eq', '5 things we learned at #ClubsCon23');
        cy.get(homePage.newsEntryDate).invoke('text').should('eq', '03/04/2023');
        // cy.get(homePage.newsEntryCategory).invoke('text').should('eq', 'News');
      });
  });
  it('should display the oldest as last', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@news');
    cy.get(homePage.newsEntries).last()
      .within(() => {
        cy.get(homePage.newsEntryDate).invoke('text').should('eq', '13/12/2022');
      });
  });
});
