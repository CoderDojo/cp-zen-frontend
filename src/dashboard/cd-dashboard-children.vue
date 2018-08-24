<template>
  <div class="column">
    <div v-if="isDisplayable" class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My Children') }}</h1>
      <div class="cd-dashboard-children__child" v-for="child in children">
        <h3>{{ child.firstName }} {{ child.lastName }}</h3>
      </div>
    </div>
    <div v-else class="cd-dashboard-children cd-filler">
      <h1 class="cd-dashboard-children__header cd-dashboard-children__header--filler"></h1>
      <div class="cd-dashboard-children__child">
        <div class="cd-dashboard-children__child cd-dashboard-children__child--filler"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserService from '@/users/service';

  export default {
    name: 'cd-dashboard-children',
    data() {
      return {
        loadedChildren: false,
        currentUser: null,
        userProfile: {},
        userChildren: [],
      };
    },
    computed: {
      children() {
        if (this.userChildren) {
          return this.userChildren;
        }
        return null;
      },
      hasChildren() {
        return (this.userChildren && this.userChildren.length > 0);
      },
      isDisplayable() {
        return this.hasChildren && this.loadedChildren;
      },
    },
    methods: {
      async loadCurrentUser() {
        const res = await UserService.getCurrentUser();
        this.currentUser = res.body.user;
      },
      async loadProfile() {
        this.userProfile = (await UserService.userProfileData(this.currentUser.id)).body;
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
      await this.loadCurrentUser();
      await this.loadProfile();
      this.loadChildren().then(this.loadedChildren = true);
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-filler-loading";

  .cd-dashboard-children {
    background-color: #fff;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    display:flex;
    flex-direction: column;

    &__header {
      margin: 45px 0 16px 0;
      &--filler {
        background-color: @cd-very-light-grey;
        height: 40px;
      }
    }

    &__child {
      margin: 16px 0 16px 0;
      display: flex;
      flex-direction: column;
      &--filler {
        height: 150px;
        background-color: @cd-very-light-grey;
      }
    }
  }
</style>

