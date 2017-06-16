import moment from 'moment';

export default date => moment(date).utc().format('h:mma').replace(':00', '');

