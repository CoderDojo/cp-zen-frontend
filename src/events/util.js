import { find } from 'lodash';
import moment from 'moment';
import i18n from '@/i18n';

const recurrences = {
  biweekly: 'Every two weeks',
  weekly: 'Weekly',
};

export default {
  buildRecurringFrequencyInfo(event) {
    const dayName = moment(event.dates[0].startTime).utc().format('dddd');
    const recurrence = recurrences[event.recurringType];
    return `${i18n.t(recurrence)} ${i18n.t('on')} ${dayName}`;
  },
  getNextStartTime(event) {
    const now = moment();
    const nextDateInfo = find(event.dates, (dateInfo) => {
      const dateMoment = moment(dateInfo.startTime);
      dateMoment.subtract(dateMoment.utcOffset(), 'minutes');
      return dateMoment.isAfter(now);
    });
    return nextDateInfo ? nextDateInfo.startTime : event.dates[event.dates.length - 1].startTime;
  },
  isRecurring(event) {
    return event.type === 'recurring';
  },
  orderByStartTime(event1, event2) {
    const startTime1 = moment(event1.startTime).valueOf();
    const startTime2 = moment(event2.startTime).valueOf();
    if (startTime1 < startTime2) {
      return -1;
    }
    if (startTime1 > startTime2) {
      return 1;
    }
    return 0;
  },
};
