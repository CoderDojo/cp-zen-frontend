import vueUnitHelper from 'vue-unit-helper';
import IcsLink from '@/events/cd-ics-link';
import TimeShift from 'timeshift-js';

describe('ICS link component', () => {
  describe('computed', () => {
    describe('url', () => {
      it('should return the url to recover the dojo events', () => {
        const vm = vueUnitHelper(IcsLink);
        Date = TimeShift.Date; // eslint-disable-line no-global-assign
        TimeShift.setTimezoneOffset(-120); // UTC+2 (Italy, summer time)
        TimeShift.setTime(1501079400000); // 2017-07-26 16:30:00 GMT+02:00
        vm.dojoId = 1;

        expect(vm.url).to.match(/\/api\/3\.0\/dojos\/1\/events\.ics\?query\[status\]=published&query\[afterDate\]=1501079400&query\[utcOffset\]=120&query\[zone\]=.+\/.+/);
      });
    });
  });
});
