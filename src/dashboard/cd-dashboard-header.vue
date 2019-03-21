<template>
  <div class="cd-dashboard-header">
    <h1 class="cd-dashboard-header--generic" v-if="hasDojos || hasLeads || hasRequests">{{ $t('Hey {name}, here\'s what\'s most important...', { name: firstName }) }}</h1>
    <h1 class="cd-dashboard-header--volunteer" v-if="!hasDojos && !hasLeads && !hasRequests && ready">{{ $t('Hey {name}, once you join or start a Dojo this page will have useful information about your Dojos', { name: firstName }) }}</h1>
  </div>
</template>

<script>
  import DojosService from '@/dojos/service';

  export default {
    name: 'cd-dashboard-header',
    props: ['hasDojos', 'hasRequests', 'firstName', 'userId'],
    data() {
      return {
        leads: [],
        ready: false,
      };
    },
    computed: {
      hasLeads() {
        return this.leads.length > 0;
      },
    },
    methods: {
      async loadLeads() {
        const res = await DojosService.lead.list(this.userId);
        this.leads = res.body;
      },
    },
    created() {
      // Don't await, so we don't block rendering.
      // It's unecessary here as 90% of users will not fall under this scenario
      this.loadLeads().then(() => {
        this.ready = true;
      });
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-dashboard-header {
    color: @cd-white;
    text-align: center;
  }
</style>
