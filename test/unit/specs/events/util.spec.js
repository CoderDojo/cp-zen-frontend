import EventsUtil from 'inject-loader!@/events/util';

describe('Events Util', () => {
  const EventsUtilWithMock = EventsUtil({
    '@/i18n': {
      t: val => val,
    },
  }).default;

  const mockRecurringEventData = {
    address: 'CHQ',
    type: 'recurring',
    recurringType: 'biweekly',
    dates: [
      {
        startTime: '2017-06-03T10:00:00.000Z',
        endTime: '2017-06-03T12:00:00.000Z',
      },
      {
        startTime: '2017-06-17T10:00:00.000Z',
        endTime: '2017-06-17T12:00:00.000Z',
      },
      {
        startTime: '2017-07-01T10:00:00.000Z',
        endTime: '2017-07-01T12:00:00.000Z',
      },
      {
        startTime: '2017-07-15T10:00:00.000Z',
        endTime: '2017-07-15T12:00:00.000Z',
      },
      {
        startTime: '2017-07-29T10:00:00.000Z',
        endTime: '2017-07-29T12:00:00.000Z',
      },
    ],
  };

  describe('buildRecurringFrequencyInfo()', () => {
    it('should return the correct string when event type is recurring', () => {
      // ACT
      const message = EventsUtilWithMock.buildRecurringFrequencyInfo(mockRecurringEventData);

      // ASSERT
      expect(message).to.equal('Every two weeks on Saturday');
    });
  });
});
