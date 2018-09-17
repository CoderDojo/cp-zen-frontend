import homePage from '../../pages/home';

describe('Homepage component visibility', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should redirect to the login page if there is no logged in user', () => {
    cy.route('/api/2.0/users/instance', 'fx:loggedOutUser').as('notLoggedIn');
    cy.visit('/home');
    cy.wait('@notLoggedIn');
    cy.url().should('include', '/login');
  });

  it('should show the stats if the user is a champion', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/parent1').as('parentProfile');
    cy.route('POST', '/api/2.0/dojos/users', [{ userTypes: ['champion'] }]).as('userDojos');
    cy.route('POST', '/api/2.0/dojos/load-dojo-users', { response: [] }).as('dojoUsers');
    cy.route('POST', '/api/2.0/events/applications/search', []).as('bookedChildren');
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@parentProfile');
    cy.get(homePage.statsTitle).should('be.visible');
  });
  it('should hide the stats if the user is not a champion', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    // NOTE: this profile only exists because cypress cannot overwrite an API fixture once defined
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/parent1WithBadges').as('parentProfile');
    cy.route('POST', '/api/2.0/dojos/users', [{ userTypes: ['banana'] }]).as('userDojos');
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@parentProfile');
    cy.get(homePage.statsTitle).should('not.be.visible');
  });
  it('should hide the sidebar if the user has no children and isnt a champion', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    // NOTE: this profile only exists because cypress cannot overwrite an API fixture once defined
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:profiles/adultWithoutChildren').as('parentProfile');
    cy.route('POST', '/api/2.0/dojos/users', [{ userTypes: ['banana'] }]).as('userDojos');
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@parentProfile');
    cy.get(homePage.sidebar).should('not.be.visible');
  });
});
