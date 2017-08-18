import moment from 'moment';

export default date => moment.utc(date).format('h:mma').replace(':00', '');
