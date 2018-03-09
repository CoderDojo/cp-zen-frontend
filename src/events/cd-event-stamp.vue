<template>
  <router-link :to="getDojoUrl(dojo)" class="cd-event-stamp" v-if="event && !dojo.private">
      {{ $t('Next event on {date}', { date }) }}
  </router-link>
</template>
<script>
  import moment from 'moment';
  import DojosUtil from '@/dojos/util';
  import EventService from './service';

  export default {
    name: 'event-stamp',
    props: ['dojo'],
    data() {
      return {
        event: null,
      };
    },
    computed: {
      date() {
        const toBeFormatted = (this.event.startTime) ||
          this.event.dates[0].startTime;
        return moment(toBeFormatted).format('dddd, MMMM Do');
      },
    },
    methods: {
      getDojoUrl: DojosUtil.getDojoUrl,
    },
    async created() {
      const events = await EventService.v3.get(
        this.dojo.id,
        {
          params:
          {
            pageSize: 1,
            query: {
              status: 'published',
              public: 1,
              afterDate: moment().format('X'),
              utcOffset: moment().utcOffset(),
            },
          },
        });
      if (events.body.results && events.body.results.length > 0) {
        this.event = events.body.results[0];
      }
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-event-stamp {
    margin-top: 8px;
    color: @cd-orange;
    padding: 6px;
    border: solid 1px @cd-orange;
    border-radius: 6px;
    font-weight: 800;
    text-align: center;
    display: inline-table;
  }
</style>
