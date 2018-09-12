<template>
  <div class="cd-dashboard">
    <dashboard-events/>
    <div class="cd-dashboard__container">
      <div class="cd-dashboard__left-column">
        <dashboard-projects/>
        <dashboard-news />
      </div>
      <div class="cd-dashboard__right-column">
        <dashboard-children/>
        <dashboard-stats v-if="userDojos && statsAreVisible" user-dojos="championUserDojos"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DojoService from '@/dojos/service';
  import DashboardEvents from '@/dashboard/cd-dashboard-events';
  import DashboardProjects from '@/dashboard/cd-dashboard-projects';
  import DashboardChildren from '@/dashboard/cd-dashboard-children';
  import DashboardNews from '@/dashboard/cd-dashboard-news';
  import DashboardStats from '@/dashboard/cd-dashboard-stats';

  export default {
    name: 'Home',
    data() {
      return {
        userDojos: null,
      };
    },
    components: {
      DashboardEvents,
      DashboardProjects,
      DashboardChildren,
      DashboardNews,
      DashboardStats,
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      statsAreVisible() {
        return this.championUserDojos.length > 0;
      },
      championUserDojos() {
        return this.userDojos.filter(ud => ud.userTypes.includes('champion'));
      },
    },
    methods: {
      async getUserDojos() {
        this.userDojos = (await DojoService.getUsersDojos(this.loggedInUser.id)).body;
      },
    },
    async created() {
      await this.getUserDojos();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .cd-dashboard {
    display: flex;
    flex-direction: column;

    &__container {
      display:flex;
      margin: 0 -16px;
    }

    &__left-column {
      flex: 1;
    }

    &__right-column {
      background-color: @side-column-grey;
      flex: 1;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard {

      &__container {
        flex-direction: column-reverse;
      }
    }
  }
</style>
