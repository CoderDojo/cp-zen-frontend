import EventsUtil from 'inject-loader!@/events/util';
import moment from 'moment';

describe('Events Util', () => {
  const EventsUtilWithMock = EventsUtil({
    '@/i18n': {
      t: val => val,
    },
  }).default;

  const mockEventData = {
    address: 'CHQ',
    type: 'one-off',
    recurringType: 'weekly',
    dates: [
      {
        startTime: '2017-06-06T16:30:00.000Z',
        endTime: '2017-06-06T18:00:00.000Z',
      },
    ],
  };

  const weekFromToday = moment().add(1, 'weeks');
  const twoWeeksFromToday = moment().add(2, 'weeks');
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
        startTime: weekFromToday,
        endTime: '2017-07-15T12:00:00.000Z',
      },
      {
        startTime: twoWeeksFromToday,
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

  describe('getNextStartTime', () => {
    it('should return the first event startTime date after now', () => {
      // ARRANGE
      const event = mockRecurringEventData;
      // ACT
      const nextStartTime = EventsUtilWithMock.getNextStartTime(event);
      // ASSERT
      expect(nextStartTime).to.deep.equal(weekFromToday);
    });
  });

  describe('isRecurring()', () => {
    it('should return true when event type is recurring', () => {
      // ARRANGE
      const event = mockRecurringEventData;
      // ACT
      const recurring = EventsUtilWithMock.isRecurring(event);
      // ASSERT
      expect(recurring).to.be.true;
    });

    it('should return false when event type is not recurring', () => {
      // ARRANGE
      const event = mockEventData;
      // ACT
      const recurring = EventsUtilWithMock.isRecurring(event);
      // ASSERT
      expect(recurring).to.be.false;
    });
  });
});
