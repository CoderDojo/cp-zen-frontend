import homePage from '../../pages/home';

describe('Homepage projects', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/v1/en/projects?order=desc', 'fx:projects').as('projects');
    cy.route('/api/v1/de-de/projects?order=desc', 'fx:projectsDE').as('projectsDE');
    cy.route('/api/v1/pt-pt/projects?order=desc', '').as('projectsPT');
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
  it('should display the project in Deutsch', () => {
    cy.setCookie('NG_TRANSLATE_LANG_KEY', '%22de_DE%22')
      .visit('/home')
      .then(() => {
        cy.wait('@loggedIn');
        cy.wait('@projectsDE');
        return cy.get(homePage.projectCards)
          .first()
          .find(homePage.projectCard)
          .first()
          .find('h4')
          .invoke('text')
          .should('eq', 'Verschollen im Weltraum');
      });
  });

  it('should display the projects in English if Deutsch isnt available', () => {
    cy.setCookie('NG_TRANSLATE_LANG_KEY', '%22pt_PT%22')
      .visit('/home').then(() => {
        cy.wait('@loggedIn');
        cy.wait('@projectsPT');
        cy.wait('@projects');
        cy.get(homePage.projectCards)
          .first()
          .find(homePage.projectCard)
          .first()
          .find('h4')
          .invoke('text')
          .should('eq', 'Advanced HTML & CSS for Social Innovation');
        // Ensure the urls fallbacks to EN as well
        cy.get(homePage.projectCards)
          .first()
          .find(homePage.projectCard)
          .first()
          .should('have.attr', 'href', 'https://projects.raspberrypi.org/en/projects/cd-sebento-htmlcss-3');
      });
  });
});
