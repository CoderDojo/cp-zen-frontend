import Vue from 'vue';
import vueUnitHelper from 'vue-unit-helper';
import eventList from '!!vue-loader?inject!@/events/cd-event-list';

describe('Event list component', () => {
  function setUpEventListComponentWithMockEvents(mockEventsBody) {
    const mockService = {
      loadEvents: (/* dojoId */) => Promise.resolve({ body: mockEventsBody }),
    };
    const eventListWithMocks = eventList({
      './service': mockService,
    });
    return eventListWithMocks;
  }

  it('should show the list of dojo events', (done) => {
    const mockEventDataResponse = [
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

    const EventListWithMock = setUpEventListComponentWithMockEvents(mockEventDataResponse);
    const vm = new Vue(EventListWithMock);
    vm.dojo = { id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77' };
    vm.loadEvents();
    requestAnimationFrame(() => {
      expect(vm.events).to.deep.equal(mockEventDataResponse);
      done();
    });
  });

  describe('getSessionListForEvent()', () => {
    it('should return a list of session names for given event', () => {
      const vm = vueUnitHelper(eventList());
      const eventMock = {
        sessions: [
          { name: 'Scratch' },
          { name: 'Arduino' },
          { name: 'HTML' },
        ],
      };

      expect(vm.getSessionListForEvent(eventMock)).to.equal('Scratch, Arduino, HTML');
    });
  });

  describe('isEventFull()', () => {
    it('should return true for an event which is full and false for one which is not full', () => {
      const vm = vueUnitHelper(eventList());
      vm.events = [
        {
          id: 1,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 3,
                },
                {
                  quantity: 4,
                  approvedApplications: 4,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 2,
                },
                {
                  quantity: 5,
                  approvedApplications: 5,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          sessions: [
            {
              tickets: [
                {
                  quantity: 3,
                  approvedApplications: 2,
                },
                {
                  quantity: 4,
                  approvedApplications: 3,
                },
              ],
            },
            {
              tickets: [
                {
                  quantity: 2,
                  approvedApplications: 1,
                },
                {
                  quantity: 5,
                  approvedApplications: 4,
                },
              ],
            },
          ],
        },
      ];

      expect(vm.isEventFull(1)).to.equal(true);
      expect(vm.isEventFull(2)).to.equal(false);
    });
  });
});
