<template>
  <div class="cd-dashboard">
    <dashboard-events/>
    <div class="cd-dashboard__container">
      <div class="cd-dashboard__right-column">
        <dashboard-projects/>
        <dashboard-news />
      </div>
      <dashboard-children class="cd-dashboard__left-column"/>
      <!-- <dashboard-stats class="cd-dashboard__left-column"/> -->
    </div>
  </div>
</template>

<script>
import DashboardEvents from '@/dashboard/cd-dashboard-events';
import DashboardProjects from '@/dashboard/cd-dashboard-projects';
import DashboardChildren from '@/dashboard/cd-dashboard-children';
import DashboardNews from '@/dashboard/cd-dashboard-news';
import DashboardStats from '@/dashboard/cd-dashboard-stats';

export default {
  name: 'Home',
  data() {
    return {
    };
  },
  components: {
    DashboardEvents,
    DashboardProjects,
    DashboardChildren,
    DashboardNews,
    DashboardStats,
  },
};
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";

  .cd-dashboard {
    display: flex;
    flex-direction: column;

    &__container {
      display:flex;
      margin: 0 -16px;
    }

    &__left-column {
      background-color: #f4f5f6;
      max-width: 340px;
      flex: 4;
    }
  }
</style>
