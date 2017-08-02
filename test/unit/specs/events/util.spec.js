import EventsUtil from 'inject-loader!@/events/util';
import moment from 'moment';
import TimeShift from 'timeshift-js';

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

    it('should work for events after 10:00 AM in Kiribati (UTC+14)', () => {
      const OriginalDate = Date;
      Date = TimeShift.Date; // eslint-disable-line no-global-assign
      TimeShift.setTimezoneOffset(-840); // UTC+14 (Kiribati)
      const mockEvent = {
        recurringType: 'biweekly',
        dates: [
          {
            startTime: '2017-06-26T12:00:00.000Z',
            endTime: '2017-06-26T14:00:00.000Z',
          },
        ],
      };

      // ASSERT
      expect(EventsUtilWithMock.buildRecurringFrequencyInfo(mockEvent)).to.equal('Every two weeks on Monday');

      // CLEANUP
      Date = OriginalDate; // eslint-disable-line no-global-assign
    });

    it('should work for events before 10:00 AM in Hawaii (UTC-10)', () => {
      const OriginalDate = Date;
      Date = TimeShift.Date; // eslint-disable-line no-global-assign
      TimeShift.setTimezoneOffset(600); // UTC-10 (Hawaii)
      const mockEvent = {
        recurringType: 'biweekly',
        dates: [
          {
            startTime: '2017-06-26T08:00:00.000Z',
            endTime: '2017-06-26T08:00:00.000Z',
          },
        ],
      };

      // ASSERT
      expect(EventsUtilWithMock.buildRecurringFrequencyInfo(mockEvent)).to.equal('Every two weeks on Monday');

      // CLEANUP
      Date = OriginalDate; // eslint-disable-line no-global-assign
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

    describe('timezones', () => {
      const OriginalDate = Date;

      beforeEach(() => {
        Date = TimeShift.Date; // eslint-disable-line no-global-assign
      });

      afterEach(() => {
        Date = OriginalDate; // eslint-disable-line no-global-assign
      });

      it('should work for events where the next date and time has past in local timezone (UTC+2), but not UTC', () => {
        // ARRANGE
        TimeShift.setTimezoneOffset(-120); // UTC+2 (Italy, summer time)
        TimeShift.setTime(1501079400000); // 2017-07-26 16:30:00 GMT+02:00

        const mockEvent = {
          dates: [
            {
              startTime: '2017-07-19T16:00:00.000Z',
            },
            {
              startTime: '2017-07-26T16:00:00.000Z',
            },
            {
              startTime: '2017-08-02T16:00:00.000Z',
            },
          ],
        };

        // ACT + ASSERT
        expect(EventsUtilWithMock.getNextStartTime(mockEvent)).to.equal('2017-08-02T16:00:00.000Z');
      });

      it('should work for events where the next date is in the future in local timezone (UTC-4), but not UTC', () => {
        // ARRANGE
        TimeShift.setTimezoneOffset(240); // UTC-4 (New York, summer time)
        TimeShift.setTime(1501079400000); // 2017-07-26 10:30:00 GMT-04:00
        const mockEvent = {
          dates: [
            {
              startTime: '2017-07-19T11:00:00.000Z',
            },
            {
              startTime: '2017-07-26T11:00:00.000Z',
            },
            {
              startTime: '2017-08-02T11:00:00.000Z',
            },
          ],
        };

        // ACT + ASSERT
        expect(EventsUtilWithMock.getNextStartTime(mockEvent)).to.equal('2017-07-26T11:00:00.000Z');
      });
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
