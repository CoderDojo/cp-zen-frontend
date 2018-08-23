<template>
  <div class="column">
    <div class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My Children') }}</h1>
      <div class="cd-dashboard-children__child" v-for="child in children">
        <h3 class="cd-dashboard-children__name">{{ child.firstName }} {{ child.lastName }}</h3>
        <span class="cd-dashboard-children__badges" v-if="child.badges" >
          <div class="cd-dashboard-children__badge" v-for="badge in child.badges.slice(0,3)">
            <img class="cd-dashboard-children__badge-image" :src="badge.imageUrl" />
            <span class="cd-dashboard-children__badge-text">{{ badge.name }}</span>
          </div>
          <a class="cd-dashboard-children__badges-link" v-if="child.badges.length > 3">{{ $t('See all {badgesAmount} badges', {badgesAmount: child.badges.length}) }}</a>
        </span>
        <p v-else>{{ $t('{name} doesn\'t have any badges yet. Talk to the organisers of your Dojo to learn how {name} can be rewarded through badges.', { name: child.firstName }) }}</p>
      </div>
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

    &__badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &-link {
        margin: 16px 0 0;
      }
    }

    &__badge {
      margin: 8px;
      width: 63px;
      height: 100%;
      text-align: center;

      &-image {
        height: 63px;
        width: 63px;
      }
      &-text {
        text-align: center;
        font-size: 10px;
      }
    }
  }
</style>

