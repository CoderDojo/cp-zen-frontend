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
        const toBeFormatted = (this.event.date && this.event.date.startTime) ||
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
            limit: 1,
            public: 1,
            date_after: Date.now(),
          },
        });
      if (events.body.length > 0) {
        this.event = events.body[0];
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
