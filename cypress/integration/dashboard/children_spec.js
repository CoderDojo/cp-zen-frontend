import homePage from '../../pages/home';

describe('Homepage children', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should show the user children info', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/parent1').as('parentProfile');
    cy.visit('/home');
    cy.get(homePage.childrenTitle).should('be.visible');
    cy.wait('@loggedIn');
    cy.wait('@parentProfile');
    // Check how many children
    cy.get(homePage.childrenNames).should('have.length', 3);
    let child1 = cy.get(homePage.childrenNames).first();
    // Check the first username
    child1.invoke('text').then((childText) => cy.wrap(childText.toString().trim()).should('eq','parent 1one'));
    child1 = cy.get(homePage.childrenNames).first();
  });
  it('should show the user children badges', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    // NOTE: this profile only exists because cypress cannot overwrite an API fixture once defined
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/parent1WithBadges').as('parentProfile');
    cy.visit('/home');
    cy.wait('@loggedIn');
    // Parent profile: list children ids
    cy.wait('@parentProfile');
    // Children profile: list children badges
    cy.wait('@parentProfile');
    cy.wait('@parentProfile');
    cy.wait('@parentProfile');
    let child1 = cy.get(homePage.children).first();
    child1.within((child) => {
      let badges = cy.get(homePage.childrenBadges);
      badges.should('have.length', 3);
      badges.first().find('img').should('have.attr', 'src', 'http://badgekit.coderdojo.com:80/images/badge/57');
      // first() mutates the var to its result, so we need to re-pull the selector
      badges = cy.get(homePage.childrenBadges);
      // Check the badge img url
      badges.last().find('img').should('have.attr', 'src', 'http://badgekit.coderdojo.com:80/images/badge/50');
    });
    child1 = cy.get(homePage.children).first();
    child1.find('.cd-dashboard-children__badges > a')
      .should('have.attr', 'href', '/dashboard/children/u1')
      .invoke('text').should('eq', 'See all 3 badges');
  });
  it('should show the view all children link', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/parent1').as('parentProfile');
    cy.visit('/home');
    cy.wait('@loggedIn');
    // Parent profile: list children ids
    cy.wait('@parentProfile');
    let children = cy.get(homePage.children);
    children.should('have.length', 3);
    let link = cy.get(homePage.childrenLink);
    link.invoke('text').should('eq', 'View my children');
  });
});
