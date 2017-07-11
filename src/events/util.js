import moment from 'moment';
import i18n from '@/i18n';

const recurrences = {
  biweekly: 'Every two weeks',
  weekly: 'Weekly',
};

export default {
  buildRecurringFrequencyInfo(event) {
    const dayName = moment(event.dates[0].startTime).format('dddd');
    const recurrence = recurrences[event.recurringType];
    return `${i18n.t(recurrence)} ${i18n.t('on')} ${dayName}`;
  },
};
