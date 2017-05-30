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
        },
      }).returns(Promise.resolve(expectedEvents));

    EventsService.loadEvents('3ed47c6d-a689-46a0-883b-1f3fd46e9c77').then((events) => {
      expect(events).to.deep.equal(expectedEvents);
      done();
    });
  });
});
