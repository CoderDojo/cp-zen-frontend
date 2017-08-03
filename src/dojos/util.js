import moment from 'moment';
import i18n from '@/i18n';

const pluralDays = [
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
  'Sundays',
];
const singularDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const nthStrings = {
  first: 'First',
  '2nd': 'Second',
  '3rd': 'Third',
  '4th': 'Fourth',
  last: 'Last',
};

export default {
  getDojoUrl(dojo) {
    return `/dojos/${dojo.url_slug || dojo.urlSlug}`;
  },
  buildDojoFrequency(dojo) {
    const startTime = dojo.startTime
      ? moment(dojo.startTime, 'HH:mm').format('h:mma').replace(':00', '')
      : null;
    const endTime = dojo.endTime
      ? moment(dojo.endTime, 'HH:mm').format('h:mma').replace(':00', '')
      : null;
    switch (dojo.frequency) {
      case '1/w': {
        return i18n.t('{day} {startTime} - {endTime}, Weekly', {
          day: i18n.t(pluralDays[dojo.day - 1]),
          startTime,
          endTime,
        });
      }
      case '2/m': {
        return i18n.t('{day} {startTime} - {endTime}, Every two weeks', {
          day: i18n.t(pluralDays[dojo.day - 1]),
          startTime,
          endTime,
        });
      }
      case '1/m': {
        if (dojo.alternativeFrequency) {
          return i18n.t('{nth} {day} of the month, {startTime} - {endTime}', {
            nth: i18n.t(nthStrings[dojo.alternativeFrequency]),
            day: i18n.t(singularDays[dojo.day - 1]),
            startTime,
            endTime,
          });
        }
        return i18n.t('{day} {startTime} - {endTime}, Monthly', {
          day: i18n.t(pluralDays[dojo.day - 1]),
          startTime,
          endTime,
        });
      }
      default: {
        return dojo.alternativeFrequency;
      }
    }
  },
};
