<template>
  <span class="cd-ics-link">
    <a :href="url" type="text/calendar">Add to your calendar</a>
  </span>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'IcsLink',
    props: ['dojoId'],
    computed: {
      url() {
        const afterDate = moment().unix();
        const utcOffset = moment().utcOffset();
        return `/api/3.0/dojos/${this.dojoId}/events.ics?query[status]=published&query[afterDate]=${afterDate}&query[utcOffset]=${utcOffset}`;
      },
    },
  };
</script>
<style scoped lang="less">
</style>
