<template>
  <div class="cd-dashboard">
    <dashboard-events/>
    <div class="cd-dashboard__container">
      <div class="cd-dashboard__left-column">
        <dashboard-projects/>
        <dashboard-news />
      </div>
      <div class="cd-dashboard__right-column">
        <dashboard-children v-if="userProfile && childrenAreVisible" :user-profile="userProfile"/>
        <dashboard-stats v-if="userDojos && statsAreVisible" :user-dojos="filterUserDojos('champion')"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DojoService from '@/dojos/service';
  import UserService from '@/users/service';
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
        userProfile: null,
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
        return this.filterUserDojos('champion').length > 0;
      },
      childrenAreVisible() {
        return !!(this.userProfile &&
          this.userProfile.children &&
          this.userProfile.children.length > 0);
      },
      highestUserRole() {
        /* eslint-disable no-nested-ternary */
        return this.filterUserDojos('champion').length ? 'champion' :
          this.filterUserDojos('mentor').length ? 'mentor' :
            this.filterUserDojos('parent-guardian').length ? 'parent-guardian' :
              'ninja';
        /* eslint-enable no-nested-ternary */
      },
    },
    methods: {
      filterUserDojos(role) {
        return this.userDojos.filter(ud => ud.userTypes.includes(role));
      },
      async getUserDojos() {
        this.userDojos = (await DojoService.getUsersDojos(this.loggedInUser.id)).body;
      },
      async loadProfile() {
        this.userProfile = (await UserService.userProfileData(this.loggedInUser.id)).body;
      },
      setUserDimension() {
        this.$ga.set('dimension1', this.highestUserRole);
      },
    },
    async created() {
      this.loadProfile();
      await this.getUserDojos();
      this.setUserDimension();
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
      flex: 3;
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
