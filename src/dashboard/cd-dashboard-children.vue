<template>
  <div class="column">
    <div class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My Children') }}</h1>
      <div class="cd-dashboard-children__child" v-for="child in children">
        <h3>{{ child.name }}</h3>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import UserService from '@/users/service';
  import { mapGetters } from 'vuex';

  export default {
    name: 'cd-dashboard-children',
    data() {
      return {
        userProfile: {},
        userChildren: [],
      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      children() {
        if (this.userChildren) {
          return this.userChildren;
        }
        return null;
      },
    },
    methods: {
      async loadProfile() {
        this.userProfile = (await UserService.userProfileData(this.loggedInUser.id)).body;
      },
      async loadChildren() {
        if (this.userProfile.children) {
          this.userChildren = (await Promise.all(
            this.userProfile.children.map(
              child => UserService.userProfileData(child))))
            .map(res => res.body);
        }
      },
    },
    async created() {
      await this.loadProfile();
      this.loadChildren();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-dashboard-children {
    background-color: #fff;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    display:flex;
    flex-direction: column;

    &__header {
      margin: 45px 0 16px 0;
    }

    &__child {
      margin: 16px 0 16px 0;
      display: flex;
      flex-direction: column;
    }
  }
</style>

