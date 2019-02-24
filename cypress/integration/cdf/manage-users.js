import page from '../../pages/cdf-manage-users';

const displayUserInfo = () => {
  cy.get(page.userName).invoke('text').should('eq', 'parent 1one');
  cy.get(page.userType).invoke('text').should('eq', 'User type: parent-guardian');
  cy.get(page.ownership).invoke('text').should('eq', 'User is dojo owner of CD ROM');
  cy.get(page.userRole).invoke('text').should('eq', 'User is champion of CD ROM');
  // Multi-domain not supported by cypress
  // cy.get(page.forumInfo).invoke('text').should('eq', 'User found on the forum, please delete there first');
  cy.get(page.noForumInfo).invoke('text').should('contain', 'User not found on the forum');
};

const displayChildInfo = () => {
  cy.get(page.childName).first().invoke('text').should('eq', 'Child 1one - attendee-u13');
  cy.get(page.childLink).first().invoke('text').should('eq', 'Load this user');
  cy.get(page.childLink).first().should('have.attr', 'href').and('eq', '/cdf/dashboard/users?userId=pc1');
  cy.get(page.childName).last().invoke('text').should('eq', 'Child 2two - attendee-o13');
  cy.get(page.childLink).last().invoke('text').should('eq', 'Load this user and review their forum account');
  cy.get(page.childLink).last().should('have.attr', 'href').and('eq', '/cdf/dashboard/users?userId=pc2');
};
describe('Delete user', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('/api/2.0/users/cdf/instance', 'fx:parentLoggedIn').as('CDFloggedIn');
    cy.route('/api/3.0/users?email=me@example.com&related=profile', 'fx:userProfile/collectionParent1').as('userProfile');
    cy.route('/api/3.0/users/u1?related=profile', 'fx:userProfile/parent1').as('userProfileById');
    cy.route('/api/2.0/profiles/children-for-user/u1', 'fx:children').as('children');
    cy.route('/api/2.0/dojos/b850b40e-1e10-4e3a-8a46-d076c94946c6', 'fx:dojo').as('dojo');
    cy.route('POST', '/api/2.0/dojos/users', 'fx:userDojosChampion').as('userDojosChampion');
  });

  it('should not display anything if there is no params', () => {
    cy.visit('/cdf/dashboard/users');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.get(page.header).invoke('text').should('eq', 'Delete Users');
    cy.get(page.noUserInfo).invoke('text').should('eq', 'No info available');
    cy.get(page.anonymize).should('have.attr', 'disabled').and('eq', 'disabled');
    cy.get(page.delete).should('have.attr', 'disabled').and('eq', 'disabled');
  });
  
  it('should display the users info when email is provided', () => {
    cy.visit('/cdf/dashboard/users?email=me@example.com');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfile');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.wait('@dojo');
    cy.get(page.header).invoke('text').should('eq', 'Delete Users');
    displayUserInfo();
    displayChildInfo();
  });
  it('should display an error if the email is invalid', () => {
    cy.visit('/cdf/dashboard/users?email=me@example');
    cy.get(page.emailError).invoke('text').should('eq', 'Email should be in the format: janedoe@example.com');
    cy.get(page.noUserInfo).invoke('text').should('eq', 'No info available');
    cy.get(page.anonymize).should('have.attr', 'disabled').and('eq', 'disabled');
    cy.get(page.delete).should('have.attr', 'disabled').and('eq', 'disabled');
  });
  it('should display the users info when userId is provided', () => {
    cy.visit('/cdf/dashboard/users?userId=u1');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfileById');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.wait('@dojo');
    cy.get(page.header).invoke('text').should('eq', 'Delete Users');
    displayUserInfo();
    displayChildInfo();
  });
  it('should disable the action if the user is owner', () => {
    cy.visit('/cdf/dashboard/users?userId=u1');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfileById');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.wait('@dojo');
    cy.get(page.anonymize).should('have.attr', 'disabled');
    cy.get(page.delete).should('have.attr', 'disabled');
  });
  // Multi domain is not supported by cypress
  it.skip('should display if the user does not have a forum account', () => {
    cy.visit('/cdf/dashboard/users?userId=u1');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfileById');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.get('noForumUser').invoke('text').should('eq', 'User not found on forum');
  });
  it('should allow deletion if the user is not an owner', () => {
    cy.route('POST', '/api/2.0/dojos/users', 'fx:userDojosMentor').as('userDojosChampion');
    cy.visit('/cdf/dashboard/users?userId=u1');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfileById');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.wait('@dojo');
    cy.get(page.anonymize).should('not.have.attr', 'disabled');
    cy.get(page.delete).should('not.have.attr', 'disabled');
  });
  it('should display when there is no children found', () => {
    cy.route('/api/2.0/profiles/children-for-user/u1', []).as('children');
    cy.visit('/cdf/dashboard/users?userId=u1');
    cy.wait('@loggedIn');
    cy.wait('@CDFloggedIn');
    cy.wait('@userProfileById');
    cy.wait('@children');
    cy.wait('@userDojosChampion');
    cy.wait('@dojo');
    cy.get(page.noChildren).invoke('text').should('eq', 'No children found');
  });
});
