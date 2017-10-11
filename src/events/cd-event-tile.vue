<script>
  import moment from 'moment';
  import { sortBy } from 'lodash';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import EventsUtil from './util';

  export default {
    name: 'event-tile',
    props: ['event', 'dojo', 'usersDojos', 'users'],
    computed: {
      isFull() {
        let totalEventCapacity = 0;
        let totalTicketsBooked = 0;
        this.event.sessions.forEach((session) => {
          session.tickets.forEach((ticket) => {
            totalEventCapacity += ticket.quantity;
            totalTicketsBooked += ticket.approvedApplications;
          });
        });
        return totalEventCapacity === totalTicketsBooked;
      },
      nextStartTime() {
        return EventsUtil.getNextStartTime(this.event);
      },
      isRecurring() {
        return EventsUtil.isRecurring(this.event);
      },
      recurringFrequencyInfo() {
        return EventsUtil.buildRecurringFrequencyInfo(this.event);
      },
      isPastEvent() {
        const now = moment();
        const eventStartTime = moment(this.event.dates[this.event.dates.length - 1].startTime);
        eventStartTime.subtract(eventStartTime.utcOffset(), 'minutes');
        return now.isAfter(eventStartTime);
      },
      formattedStartTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].startTime);
      },
      formattedEndTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].endTime);
      },
      formattedFirstDate() {
        const sortedDates = sortBy(this.event.dates, date => date.startTime);
        return this.$options.filters.cdDateFormatter(sortedDates[0].startTime);
      },
      formattedLastDate() {
        const sortedDates = sortBy(this.event.dates, date => date.startTime);
        return this.$options.filters.cdDateFormatter(sortedDates[sortedDates.length - 1].startTime);
      },
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
      cdUrlFormatter,
    },
  };
</script>
