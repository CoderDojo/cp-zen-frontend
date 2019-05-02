import moment from 'moment';
import eventPage from '../../pages/events';
import homePage from '../../pages/home';

describe('Homepage events', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should show events from multiple Dojos', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }, { dojoId: 'd2', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
    cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      { results: [{ id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'], sessions: [{ tickets: [{ type: 'ninja' }] }] }] }).as('dojoEvent1');
    cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      { results: [{ id: 'e2', name: 'event2', dojoId: 'd2', dates: ['2018-08-26T11:00:00.000'], sessions: [{ tickets: [{ type: 'ninja' }] }] }] }).as('dojoEvent2');
    cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
    cy.route('/api/2.0/dojos/d2', { id: 'd2', created: '2015-08-26T11:46:14.308Z', name: 'dojo2' }).as('dojo2');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] }).as('orders1');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e2', { results: [] }).as('orders2');
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
    cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
  });
  it('should show fully booked event', () => {
    cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
    cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }]).as('userDojos');
    cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
      {
        results: [{
          id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
          sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 42 }] }]
        }]
      }).as('dojoEvent1');
    cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
    cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] }).as('orders1');
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
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['parent-guardian'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z', name: 'dojo1' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is available to book');
      cy.get(eventPage.bookButton).should('be.visible');
    cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });

    it('should show number of tickets booked if order exists', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [{ id: 'o1', applications: [{ ticketType: 'ninja' }, { ticketType: 'ninja' }] }] }).as('orders1');
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

    it('should show that tickets require approvals if they are not approved yet', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [{ id: 'o1', applications: [{ ticketType: 'ninja', status: 'pending' }, { ticketType: 'ninja', status: 'pending' }] }] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.bookedTickets).should('be.visible');
      cy.get(eventPage.events).first().find('h4').should('have.text', 'Your "event1" tickets are waiting for approval');
      cy.get(eventPage.eventTick).should('be.visible');
      cy.get(eventPage.bookedTickets).should('have.text', '2 "Youth" tickets booked');
    });
  });

  describe('as a mentor', () => {
    it('should show "Book now" if no order exists and tickets available', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'ninja', quantity: 42, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.events).first().find('h4').should('have.text', '"event1" is available to book');
      cy.get(eventPage.bookButton).should('be.visible');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });

    it('should show number of mentor tickets booked if order exists', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'mentor', quantity: 1, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [{ id: 'o1', applications: [{ ticketType: 'mentor' }] }] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.bookedTickets).should('be.visible');
      cy.get(eventPage.bookedTickets).should('have.text', '1 "Mentor" tickets booked');
    });
    it('should show the pending request and the newcomer hints', () => {
      cy.route('/api/3.0/leads?userId=u1&deleted=0', []).as('leads');
      cy.route('/api/2.0/users/instance', {
        ok: true,
        login: {
          id: 'l1',
        },
        user: {
          id: 'u1',
          joinRequests: [{
            dojoId: 'd1',
            timestamp: new Date(),
            userType: 'mentor',
          }],
        },
      }).as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'mentor', quantity: 1, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('POST', '/api/2.0/dojos', [{ id: 'd1', created: '2015-08-26T11:46:14.308Z' }]).as('dojos');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [{ id: 'o1', applications: [{ ticketType: 'mentor' }] }] }).as('orders1');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@leads');
      cy.wait('@userDojos');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.wait('@dojo1');
      cy.wait('@dojos');
      cy.get(homePage.pendingRequests).should('have.length', 1);
      cy.get(homePage.pendingRequestsInfo).should('be.visible');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });

    it('should show the pending request, but not the newcomer hints when hes a returning user', () => {
      const createdAt = moment().add(-90, 'days');
      cy.route('/api/3.0/leads?userId=u1&deleted=0', []).as('leads');
      cy.route('/api/2.0/users/instance', {
        ok: true,
        login: {
          id: 'l1',
        },
        user: {
          id: 'u1',
          joinRequests: [{
            dojoId: 'd1',
            timestamp: new Date(),
            userType: 'mentor',
          }],
          when: createdAt,
        },
      }).as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{ tickets: [{ type: 'mentor', quantity: 1, approvedApplications: 0 }] }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('POST', '/api/2.0/dojos', [{ id: 'd1', created: '2015-08-26T11:46:14.308Z' }]).as('dojos');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [{ id: 'o1', applications: [{ ticketType: 'mentor' }] }] }).as('orders1');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@leads');
      cy.wait('@userDojos');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.wait('@dojo1');
      cy.wait('@dojos');
      cy.get(homePage.pendingRequests).should('have.length', 1);
      cy.get(homePage.pendingRequestsInfo).should('not.be.visible');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });
  });
  describe('as a ticketing-admin', () => {
    const after2Weeks = (moment().subtract(2, 'weeks')).format();
    const after1Year = (moment().subtract(1, 'years')).format();
    it('should display info about booked youth and mentor tickets', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['champion'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            sessions: [{
              tickets: [
                { type: 'mentor', quantity: 42, approvedApplications: 1 },
                { type: 'ninja', quantity: 42, approvedApplications: 2 }]
            }]
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1', { results: [] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('not.be.visible');
      cy.get(eventPage.manageEventLink).last().find('span').first().should('have.text', '2/42 Youth booked');
      cy.get(eventPage.manageEventLink).last().find('span').last().should('have.text', '1/42 Mentor booked');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });
    it('should show the eventbrite tickets as always bookable', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }], userTypes: ['mentor'] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/,
        {
          results: [{
            id: 'e1', name: 'event1', dojoId: 'd1', dates: ['2018-08-26T11:00:00.000'],
            eventbriteId: 'eb1', eventbriteUrl: 'www.eventbrite.com', sessions: []
          }]
        }).as('dojoEvent1');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo1');
      cy.route('/api/3.0/users/u1/orders?query[eventId]=e1',
        { results: [] }).as('orders1');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@dojo1');
      cy.wait('@dojoEvent1');
      cy.wait('@orders1');
      cy.get(eventPage.bookButton).should('be.visible');
      cy.get(eventPage.bookButton).should('have.attr', 'href', 'www.eventbrite.com');
      cy.get(eventPage.bookedTickets).should('not.be.visible');
      cy.get(eventPage.manageEventLink).last().should('have.attr', 'href', 'https://www.eventbrite.com/myevent?eid=eb1');
    });

    it('should show a message about EB if the dojo is old', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: after1Year }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', '\n    We see you don\'t use Zen events.\n    If you\'re using Eventbrite for your Dojo you can make it easier for attendees and volunteers to find you by using our one-click Eventbrite plugin (it\'s really easy!)');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about zen events if a dojo is new (> 2 weeks)', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: after2Weeks, name: 'dojo1' }).as('dojo');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@dojo');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', '\n        Create your first event so attendees can book and you can easily see who\'s attending.\n        It\'s simple and only takes 2 minutes!\n      ');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/dojo/d1/event-form');
      cy.get(eventPage.newDojoMessage).should('not.be.visible');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
    it('should show a message about creating an event if the dojo used Zen events (redirects to dojo create event form)', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo');
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
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'ticketing-admin' }] }, { dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents2');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: '2015-08-26T11:46:14.308Z' }).as('dojo');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: '2015-08-26T11:46:14.308Z' }).as('dojo2');
      cy.visit('/home');
      cy.wait('@oldEvents');
      cy.wait('@oldEvents2');
      cy.wait('@dojo');
      cy.wait('@dojo2');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', 'Create your next event so attendees can book in!');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/my-dojos');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
    });
  });
  describe('as a dojo-admin+ticketing-admin', () => {
    const last2Weeks = moment().format();
    it('should show two messages if the Dojo he recently created (< 2 weeks) has no events and is his first', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', [{ dojoId: 'd1', userPermissions: [{ name: 'dojo-admin' }, { name: 'ticketing-admin' }] }, { dojoId: 'd2', userPermissions: [{ name: 'ticketing-admin' }] }]).as('userDojos');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+&related=sessions\.tickets$/, { results: [] }).as('noEvents2');
      cy.route(/\/api\/3\.0\/dojos\/d1\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents');
      cy.route(/\/api\/3\.0\/dojos\/d2\/events\?query\[status\]=published&query\[afterDate\]=\d+&query\[utcOffset\]=\d+$/, { results: [{ id: 'e1', name: 'oldEvent' }] }).as('oldEvents2');
      cy.route('/api/2.0/dojos/d1', { id: 'd1', created: last2Weeks, name: 'dojo1', }).as('dojo');
      cy.route('/api/2.0/dojos/d2', { id: 'd2', created: '2015-09-15T11:46:14.308Z', name: 'dojo2', }).as('dojo2');
      cy.visit('/home');
      cy.wait('@noEvents');
      cy.wait('@noEvents2');
      cy.wait('@oldEvents');
      cy.wait('@oldEvents2');
      cy.wait('@dojo');
      cy.wait('@dojo2');
      cy.get(eventPage.noEventMessage).should('be.visible');
      cy.get(eventPage.noEventMessage).should('have.text', 'Create your next event so attendees can book in!');
      cy.get(eventPage.noEventMessage).find('a').should('have.attr', 'href', '/dashboard/my-dojos');
      cy.get(eventPage.newDojoMessage).find('a').should('have.attr', 'href', 'https://docs.google.com/forms/d/e/1FAIpQLSfkYe44Upu9ezRd7FUytxnvgmZuDxbQTPAj1BcdiqxFoBUslA/viewform?usp=pp_url&entry.1799182697=dojo1');
      cy.get(eventPage.newDojoMessage).find('a').should('have.text', 'We always ask new Dojos to do a 2 minutes survey. You don\'t have to but it helps the whole community!\n    ');
      cy.get(eventPage.fallbackCTAs).should('not.be.visible');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
     });
  });
  describe('as a potential mentor', () => {
    it('should the pending request and the newcomer hints', () => {
      cy.route('/api/3.0/leads?userId=u1&deleted=0', []).as('leads');
      cy.route('/api/2.0/users/instance', {
        ok: true,
        login: {
          id: 'l1',
        },
        user: {
          id: 'u1',
          joinRequests: [{
            dojoId: 'd1',
            timestamp: new Date(),
            userType: 'mentor',
          }],
        },
      }).as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', []).as('userDojos');
      cy.route('POST', '/api/2.0/dojos', [{
        id: 'd1',
        created: '2015-08-26T11:46:14.308Z',
      }]).as('dojo1');
      cy.visit('/home');
      cy.wait('@loggedIn');
      cy.wait('@leads');
      cy.wait('@dojo1');
      cy.get(homePage.pendingRequests).should('have.length', 1);
      cy.get(homePage.pendingRequestsInfo).should('be.visible');
      cy.get(eventPage.genericHeader).invoke('text').should('match', /(here's what's most important...)/);
    });
  });
  describe('as a normal user without event that is not ticketing-admin', () => {
    it('should display two buttons as cta', () => {
      cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('loggedIn');
      cy.route('POST', '/api/2.0/dojos/users', []).as('userDojos');
      cy.route('/api/3.0/leads?userId=u1&deleted=0', []).as('leads');
      cy.visit('/home');
      cy.wait('@userDojos');
      cy.wait('@leads');
      cy.get(eventPage.defaultHeader).should('be.visible');
      cy.get(eventPage.defaultHeader).invoke('text').should('match', /(once you join or start a Dojo this page will have useful information about your Dojos)/);
      cy.get(eventPage.fallbackCTAs).should('be.visible');
      cy.get(eventPage.fallbackCTAs).should('have.length', 2);
    });
  });
});
