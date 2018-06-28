import EventsService from '@/events/service';
import Vue from 'vue';

describe('Events Service', () => {
  const sandbox = sinon.sandbox.create();
  afterEach(() => {
    sandbox.restore();
  });
  it('should bookTickets through manageTickets', (done) => {
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
    EventsService.manageTickets(applications)
      .then(() => {
        expect(Vue.http.post).to.have.been.calledOnce;
        expect(Vue.http.post).to.have.been.calledWith(`${Vue.config.apiServer}/api/2.0/events/bulk-apply-applications`, {
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
