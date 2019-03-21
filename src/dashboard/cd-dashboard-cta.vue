<template>
  <div class="cd-dashboard__cta" >
    <div v-if="hasEvents" class="cd-dashboard_cta--returning">
      <router-link class="cd-dashboard__cta-link" :to="{ name: 'MyTickets' }" v-ga-track-click="'your_events'">{{ $t('Your events') }}</router-link>
    </div>
    <div v-if="!hasEvents && !isTicketingAdmin" class="cd-dashboard__cta--start">
      <router-link class="cd-dashboard__cta-link" :to="{ name: 'FindDojo' }" v-ga-track-click="'find_dojo'">{{ $t('Find a Dojo to attend') }}</router-link>
      <router-link class="cd-dashboard__cta-link" to="start-dojo" v-ga-track-click="'start_dojo'">{{ $t('Start a Dojo') }}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cd-dashboard-cta',
    props: ['hasEvents', 'isTicketingAdmin'],
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/variables";

  .cd-dashboard{
    &__cta {
      .cta;

      &-link {
        .button-link-sm;
        color: @cd-white;
      }
    }
  }
</style>
