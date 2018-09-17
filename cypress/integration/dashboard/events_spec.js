import eventPage from '../../pages/events';

describe('Homepage events', () => {
  beforeEach(() => {
    cy.server({ urlMatchingOptions: { matchBase: false, } });
  });

  it('should show events from multiple Dojos', () => {

  });

  describe('as a parent', () => {
    it('should display "Book now" if no order exists and tickets available', () => {

    });

    it('should show number of tickets booked if order exists', () => {

    });
  });

  describe('as a mentor', () => {
    it('should show "Book now" if no order exists and tickets available', () => {

    });

    it('should show number of mentor ticets booked if order exists', () => {

    });
  });

  describe('as a dojo-admin', () => {
    it('should display info about booked youth and mentor tickets', () => {

    });
  });
  describe('as a dojo-admin without events', () => {
    it('should show a message about EB if the dojo is old', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60$/, { results: [] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text',
        '\n          We see you don\'t use Zen events.\n          If you\'re using Eventbrite for your Dojo you can make it easier for attendees and volunteers to find you by using our one-click Eventbrite plugin (it\'s really easy!)');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about zen events if the dojo is new', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60$/, { results: [] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2018-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', '\n          Create your first event so attendees can book and you can easily see who\'s attending.\n          It\'s simple and only takes 2 minutes!');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about creating an event if the dojo used Zen events', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=60$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', 'Create your next event so attendees can book in!');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
  });
  describe('as a normal user without event that is not ticketing-admin', () => {
    it('should display two buttons as cta', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', []).as('userDojos');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.get(eventPage.fallbackCTAs).should('be.visible');
      cy.get(eventPage.fallbackCTAs).should('have.length', 2);
    }); 
  });
});
