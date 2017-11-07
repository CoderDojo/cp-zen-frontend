import vueUnitHelper from 'vue-unit-helper';
import EventListItem from '@/events/cd-event-tile';
import cdDateFormatter from '@/common/filters/cd-date-formatter';
import TimeShift from 'timeshift-js';
import moment from 'moment';

describe('Event list item component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('computed', () => {
    describe('isFull', () => {
      it('should return true for an event which is full and false for one which is not full', () => {
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
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
        };

        expect(vm.isFull).to.equal(true);

        vm.event = {
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
        };
        expect(vm.isFull).to.equal(false);
      });
    });

    describe('isPastEvent', () => {
      it('should return true for a one-off event whose date is before now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
          dates: [
            {
              startTime: '2017-06-10T16:30:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(true);
      });
      it('should return true for a recurring event whose last date is before now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.event = {
          type: 'recurring',
          dates: [
            {
              startTime: '2017-06-10T16:30:00.000Z',
            },
            {
              startTime: '2017-06-17T16:30:00.000Z',
            },
            {
              startTime: '2017-06-24T16:30:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(true);
      });
      it('should return false for a one-off event whose date is after now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const now = moment();
        const startTime = now.add(1, 'day');
        vm.event = {
          dates: [
            {
              startTime,
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(false);
      });
      it('should return false for a recurring event whose last date is after now', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        const now = moment();
        const startTime = now.add(1, 'day');

        vm.event = {
          type: 'recurring',
          dates: [
            {
              startTime: '2017-06-17T16:30:00.000Z',
            },
            {
              startTime: '2017-06-24T16:30:00.000Z',
            },
            {
              startTime,
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.isPastEvent).to.equal(false);
      });

      describe('timezones', () => {
        it('should work for one-off events where date is past in local timezone, but not UTC (UTC+2)', () => {
          // ARRANGE
          Date = TimeShift.Date; // eslint-disable-line no-global-assign
          TimeShift.setTimezoneOffset(-120); // UTC+2 (Italy, summer time)
          TimeShift.setTime(1501079400000); // 2017-07-26 16:30:00 GMT+02:00
          const vm = vueUnitHelper(EventListItem);
          vm.event = {
            type: 'one-off',
            dates: [
              {
                startTime: '2017-07-26T16:00:00.000Z',
              },
            ],
          };

          // ASSERT
          expect(vm.isPastEvent).to.equal(true);
        });

        it('should work for one-off events where date is past in local timezone, but not UTC (UTC-4)', () => {
          // ARRANGE
          Date = TimeShift.Date; // eslint-disable-line no-global-assign
          TimeShift.setTimezoneOffset(240); // UTC-4 (New York, summer time)
          TimeShift.setTime(1501079400000); // 2017-07-26 10:30:00 GMT-04:00
          const vm = vueUnitHelper(EventListItem);
          vm.event = {
            type: 'one-off',
            dates: [
              {
                startTime: '2017-07-26T11:00:00.000Z',
              },
            ],
          };

          // ASSERT
          expect(vm.isPastEvent).to.equal(false);
        });

        it('should work for recurring events where one date is past in local timezone, but not UTC, but another is in the future', () => {
          // ARRANGE
          Date = TimeShift.Date; // eslint-disable-line no-global-assign
          TimeShift.setTimezoneOffset(-120); // UTC+2 (Italy, for example)
          TimeShift.setTime(1501079400000); // 2017-07-26 16:30:00 GMT+02:00
          const vm = vueUnitHelper(EventListItem);
          vm.event = {
            type: 'one-off',
            dates: [
              {
                startTime: '2017-07-26T16:00:00.000Z',
              },
              {
                startTime: '2017-07-26T17:00:00.000Z',
              },
            ],
          };

          // ASSERT
          expect(vm.isPastEvent).to.equal(false);
        });
      });
    });

    describe('formattedFirstDate', () => {
      it('should return the correct first date despite dates not being ordered chronologically in the event data', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.$options = {
          filters: {
            cdDateFormatter,
          },
        };
        vm.event = {
          dates: [
            {
              startTime: '2018-06-10T10:00:00.000Z',
              endTime: '2018-06-10T11:00:00.000Z',
            },
            {
              startTime: '2018-06-03T10:00:00.000Z',
              endTime: '2018-06-03T11:00:00.000Z',
            },
            {
              startTime: '2018-07-29T10:00:00.000Z',
              endTime: '2018-07-29T11:00:00.000Z',
            },
            {
              startTime: '2018-06-17T10:00:00.000Z',
              endTime: '2018-06-17T11:00:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.formattedFirstDate).to.equal('June 3, 2018');
      });
    });

    describe('formattedLastDate', () => {
      it('should return the correct last date despite dates not being ordered chronologically in the event data', () => {
        // ARRANGE
        const vm = vueUnitHelper(EventListItem);
        vm.$options = {
          filters: {
            cdDateFormatter,
          },
        };
        vm.event = {
          dates: [
            {
              startTime: '2018-06-10T10:00:00.000Z',
              endTime: '2018-06-10T11:00:00.000Z',
            },
            {
              startTime: '2018-06-03T10:00:00.000Z',
              endTime: '2018-06-03T11:00:00.000Z',
            },
            {
              startTime: '2018-07-29T10:00:00.000Z',
              endTime: '2018-07-29T11:00:00.000Z',
            },
            {
              startTime: '2018-06-17T10:00:00.000Z',
              endTime: '2018-06-17T11:00:00.000Z',
            },
          ],
        };

        // ACT & ASSERT
        expect(vm.formattedLastDate).to.equal('July 29, 2018');
      });
    });
  });
});
