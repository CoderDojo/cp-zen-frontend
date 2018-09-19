import eventPage from '../../pages/events';

describe('Homepage events', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should show events from multiple Dojos', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'], userTypes: ['mentor'] }, { dojoId: 'd2', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
    cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], sessions: [{ tickets: [{ type: 'ninja' }] }] }] }).as('dojoEvent1');
    cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      { results: [{ id: 'e2', name: 'event2', dojoId: 'd2', dates: ['2018-08-26T11:00:00.000'], sessions: [{ tickets: [{ type: 'ninja' }] }] }] }).as('dojoEvent2');
    cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
    cy.route('/api/2.0/dojos/d2', { id: 'd2', createdAt: '2015-08-26T11:46:14.308Z', name: 'dojo2' }).as('dojo2');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] } ).as('orders1');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e2', { results: [] } ).as('orders2');
    cy.visit('/home');
    cy.wait('@userDojos');
    cy.wait('@dojo1');
    cy.wait('@dojo2');
    cy.wait('@dojoEvent1');
    cy.wait('@dojoEvent2');
    cy.wait('@orders1');
    cy.wait('@orders2');
    cy.get(eventPage.events).should('have.length', 2);
    cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is available to book');
    cy.get(eventPage.events).last().find('h4').should('have.text', '"event2" is available to book');
    cy.get(eventPage.dojoName).first().should('have.text', 'dojo1');
    cy.get(eventPage.dojoName).last().should('have.text', 'dojo2');
  });
  it('should show fully booked event', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: ['ticketing-admin'], userTypes: ['mentor'] }]).as('userDojos');
    cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
        sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 42 }] }] }] 
      }).as('dojoEvent1');
    cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] } ).as('orders1');
    cy.visit('/home');
    cy.wait('@userDojos');
    cy.wait('@dojo1');
    cy.wait('@dojoEvent1');
    cy.wait('@orders1');
    cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is fully booked');
    cy.get(eventPage.bookButton).should('not.be.visible');
  });

  describe('as a parent', () => {
    it('should display "Book now" if no order exists and tickets available', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: ['ticketing-admin'], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
          sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }] }] 
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] } ).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is available to book');
      cy.get(eventPage.bookButton).should('be.visible');
    });

    it('should show number of tickets booked if order exists', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: ['ticketing-admin'], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
          sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }] }] 
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', 
        { results: [{ id: 'o1', applications: [{ ticketType: 'ninja' }, { ticketType: 'ninja' }] }] } ).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.bookedTickets).should('be.visible');
      cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is booked');
      cy.get(eventPage.eventTick).should('be.visible');
      cy.get(eventPage.bookedTickets).should('have.text', '2 "Youth" tickets booked');
    });
  });

  describe('as a mentor', () => {
    it('should show "Book now" if no order exists and tickets available', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
          sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }] }] 
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] } ).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is available to book');
      cy.get(eventPage.bookButton).should('be.visible');
    });

    it('should show number of mentor tickets booked if order exists', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
          sessions: [{ tickets: [{ type: 'mentor', quantity: 1, approvedApplications: 0 }] }] }] 
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', 
        { results: [{ id: 'o1', applications: [{ ticketType: 'mentor' }] }] } ).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.bookedTickets).should('be.visible');
      cy.get(eventPage.bookedTickets).should('have.text', '1 "Mentor" tickets booked');
    });

    it('should show number of booked tickets as a ticketing-admin', () => {});
  });

  describe('as a dojo-admin', () => {
    it('should display info about booked youth and mentor tickets', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: ['ticketing-admin'], userTypes: ['champion'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], 
          sessions: [{ tickets: [
            { type: 'mentor', quantity: 42, approvedApplications: 1 },
            { type: 'ninja', quantity: 42, approvedApplications: 2 }] }] }] 
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] } ).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.manageEventLink).last().find('span').first().should('have.text', '2/42 Youth booked');
      cy.get(eventPage.manageEventLink).last().find('span').last().should('have.text', '1/42 Mentor booked');
    });
  });
  describe('as a dojo-admin without events', () => {
    it('should show a message about EB if the dojo is old', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [] }).as('oldEvents');
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
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2018-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', '\n            Create your first event so attendees can book and you can easily see who\'s attending.\n            It\'s simple and only takes 2 minutes!\n          ');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/dojo/d1/event-form');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about creating an event if the dojo used Zen events (redirects to dojo create event form)', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', 'Create your next event so attendees can book in!');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/dojo/d1/event-form');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about creating an event if a dojo used Zen events (redirects to my-dojos)', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [ { dojoId: 'd1', userPermissions: ['ticketing-admin'] }, { dojoId: 'd2', userPermissions: ['ticketing-admin'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents2');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', createdAt: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@oldEvents2');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', 'Create your next event so attendees can book in!');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/my-dojos');
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
