import homePage from '../../pages/home';

describe('Homepage projects', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/v1/en/projects?order=asc', 'fx:projects').as('projects');
  });

  it('should display the section', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@projects');
    cy.get(homePage.projectTitle)
  });
  
  it('should display the latest 3 projects', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@projects');
    cy.get(homePage.projectCards).first().find(homePage.projectCard).should('have.length', 3);
  });

  it('should display project title and its image', () => {
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@projects');
    cy.get(homePage.projectCards)
      .first()
      .find(homePage.projectCard)
      .first()
      .find('h4')
      .invoke('text')
      .should('eq', 'Advanced HTML & CSS for Social Innovation');
  });
});
