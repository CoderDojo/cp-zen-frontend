import page from '../../pages/manage-membership-requests';

describe('Membership requests', () => {
  beforeEach(() => {
    cy.server();
  });
  it('should show the accept flow for a mentor', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', dojoId: 'd1', userType: 'mentor' }).as('load');
    cy.route('PUT', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.circle).should('be.visible');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The user is now a mentor for your Dojo. This means they can now book mentor tickets and check in users to your events.');
  });
  it('should show the accept flow for a champion', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', dojoId: 'd1', userType: 'champion' }).as('load');
    cy.route('PUT', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.circle).should('be.visible');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The user is now a champion for your Dojo. This means they can now create events, modify the Dojo page and award badges.');
  });
  it('should show the declined flow', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', dojoId: 'd1', userType: 'champion' }).as('load');
    cy.route('DELETE', '/api/3.0/dojos/d1/membership-requests/rq1', {}).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/refuse');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.circle).should('be.visible');
    cy.wait('@actOnRQ');
    cy.get(page.checkmark).should('be.visible');
    cy.get(page.text).invoke('text').should('eq', 'The request to join your Dojo has been refused.');
  });
  it('should show an error message when the status is not supported', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', dojoId: 'd1', userType: 'champion' }).as('load');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/banana');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('not.be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Invalid action, try again or contact support.');
  });
  it('should show an error message when the user is not allowed to load the membership request', () => {
    cy.route({ method: 'GET', url: '/api/3.0/dojos/d1/membership-requests/rq1', status: 401, response: {} }).as('load');
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('not.be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Invalid action, try again or contact support.');
  });
  it('should show an error message when the user is already a member of the Dojo', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/profiles/user-profile-data', 'fx:parentLoggedIn').as('userProfileData');
    cy.route('/api/3.0/dojos/d1/membership-requests/rq1', { id: 'rq1', dojoId: 'd1', userType: 'champion' }).as('load');
    cy.route({ method: 'PUT', url: '/api/3.0/dojos/d1/membership-requests/rq1', status: 400, response: {} }).as('actOnRQ');
    cy.visit('/dashboard/dojos/d1/join-requests/rq1/status/accept');
    cy.wait('@loggedIn');
    cy.wait('@load');
    cy.wait('@actOnRQ');
    cy.wait('@userProfileData');
    cy.get(page.checkmark).should('not.be.visible');
    cy.get(page.circle).should('not.be.visible');
    cy.get(page.text).invoke('text').should('eq', 'Invalid action, try again or contact support.');
    cy.get(page.description).invoke('text').should('eq', 'This user is already part of your Dojo, please go to your Dojo\'s user management page to change the user\'s role.');
  });
});
