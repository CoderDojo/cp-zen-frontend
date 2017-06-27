import EventsService from '@/events/service';
import Vue from 'vue';

describe('Events Service', () => {
  const sandbox = sinon.sandbox.create();
  afterEach(() => {
    sandbox.restore();
  });
  const expectedEvents = [
    {
      id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
      name: 'My First Amazing Event',
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      dates: [
        {
          startTime: '2017-06-06T16:30:00.000Z',
          endTime: '2017-06-06T18:00:00.000Z',
        },
      ],
    },
    {
      id: '34174952-8ca4-4189-b8cb-d383e3fde992',
      name: 'My Second Amazing Event',
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      dates: [
        {
          startTime: '2017-06-06T16:30:00.000Z',
          endTime: '2017-06-06T18:00:00.000Z',
        },
      ],
    },
  ];

  it('should get dojo events', (done) => {
    const postMock = sandbox.stub(Vue.http, 'post');
    postMock.withArgs(
      `${Vue.config.apiBase}/events/search`,
      {
        query: {
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          filterPastEvents: true,
          status: 'published',
        },
      }).returns(Promise.resolve({ body: expectedEvents }));

    EventsService.loadEvents('3ed47c6d-a689-46a0-883b-1f3fd46e9c77').then((events) => {
      expect(events.body).to.deep.equal(expectedEvents);
      const mockCall = postMock.getCall(0).args[0];
      expect(mockCall).to.equal(`${Vue.config.apiBase}/events/search`);
      done();
    });
  });

  it('should get specific event details by id', (done) => {
    const eventId = 1;
    const getMock = sandbox.stub(Vue.http, 'get');
    getMock.withArgs(`${Vue.config.apiBase}/events/${eventId}`)
      .returns(Promise.resolve({ body: expectedEvents[0] }));

    EventsService.loadEvent(eventId).then((event) => {
      expect(event.body).to.deep.equal(expectedEvents[0]);
      done();
    });
  });

  it('should get specific event sessions by id', (done) => {
    const eventId = 1;
    const mockSessions = [
      {
        name: 'Scratch',
      },
      {
        name: 'Arduino',
      },
    ];
    const getMock = sandbox.stub(Vue.http, 'get');
    getMock.withArgs(`${Vue.config.apiBase}/events/${eventId}/sessions`)
      .returns(Promise.resolve({ body: mockSessions }));

    EventsService.loadSessions(eventId).then((sessions) => {
      expect(sessions.body).to.deep.equal(mockSessions);
      done();
    });
  });

  it('should bookTickets ', (done) => {
    // ARRANGE
    const applications = [
      {
        dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
        eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
        sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
        ticketName: 'Parent',
        ticketType: 'parent-guardian',
        ticketId: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af',
        userId: '74afa4b8-8449-46e4-a553-8febda8614ad',
        notes: 'N/A',
      },
    ];

    sandbox.stub(Vue.http, 'post').returns(Promise.resolve());

    // ACT
    EventsService.bookTickets(applications)
      .then(() => {
        expect(Vue.http.post).to.have.been.calledOnce;
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiBase}/events/bulk-apply-applications`, {
          applications: [
            {
              dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
              eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
              sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
              ticketName: 'Parent',
              ticketType: 'parent-guardian',
              ticketId: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af',
              userId: '74afa4b8-8449-46e4-a553-8febda8614ad',
              notes: 'N/A',
              emailSubject: {
                received: 'Your ticket request for %1$s has been received',
                approved: 'Your ticket request for %1$s has been approved',
                cancelled: 'Your ticket request for %1$s has been cancelled',
              },
            },
          ],
        });
        done();
      });
  });
});
