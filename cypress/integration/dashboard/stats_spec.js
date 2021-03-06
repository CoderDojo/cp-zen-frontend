import homePage from '../../pages/home';

describe('Homepage stats', () => {
  beforeEach(() => {
    cy.server();
    cy.route('POST', '/api/2.0/dojos/users', [{ userTypes: ['champion'] }]).as(
      'userDojos',
    );
    cy.route(
      'POST',
      '/api/2.0/profiles/user-profile-data',
      'fx:profiles/parent1',
    ).as('userProfile');
  });

  it('should show a message pushing champions to use Zen when no stats is available', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/load-dojo-users', { response: [] }).as(
      'dojoUsers',
    );
    cy.route('POST', '/api/2.0/events/applications/search', []).as(
      'bookedChildren',
    );
    cy.visit('/home');
    cy.wait('@loggedIn');
    cy.wait('@userDojos');
    cy.wait('@bookedChildren');
    cy.wait('@dojoUsers');
    cy.get(homePage.statsUseZenMessage)
      .invoke('text')
      .should(
        'eq',
        "No statistics are available at the moment.\n        The more Zen is used, the more you'll find out about your Dojo!",
      );
  });
  describe('Youth', () => {
    it('should show the stats for the number of children booked', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/load-dojo-users', {
        response: [{ gender: 'Female' }, { gender: 'Male' }, { gender: 'Male' }],
      }).as('dojoUsers');
      cy.route('POST', '/api/2.0/events/applications/search', [
        { userId: 'kid1' },
      ]).as('bookedChildren');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@bookedChildren');
      cy.wait('@userDojos');
      cy.wait('@dojoUsers');
      cy.wait('@dojoUsers');
      cy.get(homePage.statsNbYouthChart)
        .invoke('text')
        .should('eq', '1 ninjas attended your events');
    });
    it('should show the stats chart of youth gender', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/events/applications/search', [
        { userId: 'kid1' },
      ]).as('bookedChildren');
      cy.route('POST', '/api/2.0/dojos/load-dojo-users', {
        response: [{ gender: 'Female' }, { gender: 'Male' }, { gender: 'Male' }],
      }).as('dojoUsers');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@bookedChildren');
      cy.wait('@userDojos');
      cy.wait('@dojoUsers');
      cy.wait('@dojoUsers');
      cy.get(homePage.statsYouthGenderChart)
        .find('svg')
        .should('be.visible');
    });
    it('should not display the hint for girls message when the girls ratio > 30%', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/events/applications/search', [
        { userId: 'kid1' },
      ]).as('bookedChildren');
      cy.route('POST', '/api/2.0/dojos/load-dojo-users', {
        response: [{ gender: 'Female' }, { gender: 'Male' }, { gender: 'Male' }],
      }).as('dojoUsers');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@bookedChildren');
      cy.wait('@userDojos');
      cy.wait('@dojoUsers');
      cy.wait('@dojoUsers');
      cy.get(homePage.statsYouthGirlsHint).should('not.visible');
    });
    it('should display the hint for girls message when the girls ratio < 30%', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/events/applications/search', [
        { userId: 'kid1' },
      ]).as('bookedChildren');
      cy.route('POST', '/api/2.0/dojos/load-dojo-users', {
        response: [
          { gender: 'Female' },
          { gender: 'Male' },
          { gender: 'Male' },
          { gender: 'Male' },
        ],
      }).as('dojoUsers');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@bookedChildren');
      cy.wait('@userDojos');
      cy.wait('@dojoUsers');
      cy.wait('@dojoUsers');
      cy.get(homePage.statsYouthGirlsHint)
        .invoke('text')
        .should('eq', 'More information about girls in Dojos');
    });
  });
});
