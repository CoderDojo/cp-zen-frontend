import moment from 'moment';
import homePage from '../../pages/home';

describe('Homepage comms', () => {
  beforeEach(() => {
    cy.server();
  });
  describe('Dojo anniversary', () => {
    const showsOn = moment().subtract(11, 'months');
    // one day too late
    const hidesAfter = moment(showsOn).subtract(1, 'months').subtract(1, 'days');
    // 10 months too soon
    const hidesBefore = moment().subtract(2, 'months');
    it('should show a panel for Dojo anniversary to the champion if its creation date is within the good range', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }, { dojoId: 'd2', userPermissions: [{ name: 'dojo-admin' }], userTypes: ['champion'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent1');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: hidesAfter, name: 'dojo1' }).as('dojo1');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: showsOn, name: 'dojo2' }).as('dojo2');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojo2');
      cy.get(homePage.comms.anniversaryLink).should('be.visible');
      cy.get(homePage.comms.anniversaryLink).should('have.length', 1);
      cy.get(homePage.comms.anniversaryLink).invoke('text').should('be.eq', '🎉 dojo2, your Dojo anniversary is approaching! Apply now for your FREE birthday pack to celebrate');
    });
    it('should show two panels for Dojo anniversary to the champion if both creation dates are within the good range', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'dojo-admin' }], userTypes: ['champion'] }, { dojoId: 'd2', userPermissions: [{ name: 'dojo-admin' }], userTypes: ['champion'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent1');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: showsOn, name: 'dojo1' }).as('dojo1');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: showsOn, name: 'dojo2' }).as('dojo2');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojo2');
      cy.get(homePage.comms.anniversaryLink).should('be.visible');
      cy.get(homePage.comms.anniversaryLink).should('have.length', 2);
      cy.get(homePage.comms.anniversaryLink).first().invoke('text').should('be.eq', '🎉 dojo1, your Dojo anniversary is approaching! Apply now for your FREE birthday pack to celebrate');
      cy.get(homePage.comms.anniversaryLink).last().invoke('text').should('be.eq', '🎉 dojo2, your Dojo anniversary is approaching! Apply now for your FREE birthday pack to celebrate');
    });

    it('should not show a panel for Dojo anniversary if the user is not a dojo-admin', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['parent-guardian'] }, { dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent1');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: showsOn, name: 'dojo1' }).as('dojo1');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: showsOn, name: 'dojo2' }).as('dojo2');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojo2');
      cy.get(homePage.comms.anniversaryLink).should('not.be.visible');
    });

    it('should not show a panel for Dojo anniversary if date is not in the good range', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'dojo-admin' }], userTypes: ['champion'] }, { dojoId: 'd2', userPermissions: [{ name: 'dojo-admin' }], userTypes: ['champion'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent1');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('dojoEvent2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: hidesAfter, name: 'dojo1' }).as('dojo1');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: hidesBefore, name: 'dojo2' }).as('dojo2');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojo2');
      cy.get(homePage.comms.anniversaryLink).should('not.be.visible');
    });
  });
});
