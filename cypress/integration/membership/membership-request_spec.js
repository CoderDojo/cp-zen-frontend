import page from '../../pages/manage-membership-requests';

describe('Membership requests', () => {
  beforeEach(() => {
    cy.server();
  });
  it('should show the accept flow for a mentor', async () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', userType: 'mentor' }).as('load');
    cy.route('PUT', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Accepting the user...');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The user is now a mentor for your Dojo. This means they can now book mentor tickets and check in users to your events.');
  });
  it('should show the accept flow for a champion', async () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', userType: 'champion' }).as('load');
    cy.route('PUT', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Accepting the user...');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The user is now a champion for you Dojo. This means they can now create events, modify the Dojo page and award badges.');
  });
  it('should show the declined flow', async () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', userType: 'champion' }).as('load');
    cy.route('PUT', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/refuse');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Refusing this user from joining your Dojo...');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The request to join your Dojo has been refused.');
  });
  it('should show an error message when the status is not supported', async () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', userType: 'champion' }).as('load');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/banana');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('not.be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Invalid action, try again or contact support.');
  });
  it('should show an error message when the user is not allowed to load the membership request', async () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route({ method: 'GET', route: '/api/3.0/dojos/d1/membership-requests/rq1', status: 401 }).as('load');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/banana');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('not.be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Invalid action, try again or contact support.');
  });

});
