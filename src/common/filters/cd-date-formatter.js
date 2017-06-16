import moment from 'moment';

export default date => moment(date).utc().format('MMMM D, YYYY');
