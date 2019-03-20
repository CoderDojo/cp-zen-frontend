<template>
  <div class="cd-dashboard-header" v-if="ready">
    <h1 class="cd-dashboard-header--volunteer" v-if="!hasDojos && !hasLeads">{{ $t('Hey {name}, once you join or start a Dojo this page will have useful information about your Dojos', { name: firstName }) }}</h1>
       <h1 class="cd-dashboard-header--generic" v-else>{{ $t('Hey {name}, here\'s what\'s most important...', { name: firstName }) }}</h1>
  </div>
</template>

<script>
  import DojosService from '@/dojos/service';

  export default {
    name: 'cd-dashboard-header',
    props: ['hasDojos', 'firstName', 'userId'],
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
    async created() {
      await this.loadLeads();
      this.ready = true;
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-dashboard-header {
      color: @cd-white;
      margin: 0 0 48px 0;
  }
</style>
