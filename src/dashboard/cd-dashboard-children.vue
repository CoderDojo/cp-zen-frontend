<template>
  <div class="column">
    <div v-if="isDisplayable" class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My Children') }}</h1>
      <div class="cd-dashboard-children__child" v-for="child in children">
        <h3 class="cd-dashboard-children__name">
          {{ child.name }}
          <a :href="`/dashboard/profile/${child.userId}/edit`" class="cd-dashboard-children__edit-child"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
        </h3>
        <span class="cd-dashboard-children__badges" v-if="child.badges" >
          <div class="cd-dashboard-children__badge" v-for="badge in child.badges.slice(0,2)">
            <img class="cd-dashboard-children__badge-image" :src="badge.imageUrl" />
            <span class="cd-dashboard-children__badge-text">{{ badge.name }}</span>
          </div>
          <a :href="`/dashboard/children/${child.userId}`" class="cd-dashboard-children__badges-link" v-if="child.badges.length > 2">{{ $t('See all {badgesAmount} badges', {badgesAmount: child.badges.length}) }}</a>
        </span>
        <p class="cd-dashboard-children__badges-none" v-else>{{ $t('{name} doesn\'t have any badges yet. Talk to the organisers of your Dojo to learn how {name} can be rewarded through badges.', { name: child.firstName }) }}</p>
      </div>
    </div>
    <div v-else class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My Children') }}</h1>
      <div class="cd-dashboard-children__child cd-filler">
        <h3 class="cd-dashboard-children__name cd-dashboard-children__name--filler"></h3>
        <span class="cd-dashboard-children__badges cd-dashboard-children__badges--filler"></span>
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
        if (this.userChildren.length > 0) {
          return this.userChildren;
        }
        return null;
      },
      hasChildren() {
        return (this.userChildren && this.userChildren.length > 0);
      },
      isDisplayable() {
        return this.hasChildren && this.children;
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
  @import "../common/styles/cd-filler-loading";

  .cd-dashboard-children {
    background-color: #f4f5f6;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;

    &__header {
      margin: 45px 0 16px 0;
    }

    &__child {
      margin: 16px 0 16px 0;
      display: flex;
      flex-direction: column;
    }

    &__name {
      margin: 16px 0 16px 0;
      display: flex;

      &--filler {
        background-color: @cd-very-light-grey;
        height: 40px;
      }
    }

    &__badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      margin: 16px 0 16px 0;

      &-link {
        margin: 8px 0 0;
      }

      &-none {
        margin: 16px 0 16px 0;
      }

      &--filler {
        background-color: @cd-very-light-grey;
        height: 150px;
      }
    }

    &__badge {
      margin: 16px;
      width: 105px;
      height: 100%;
      text-align: center;

      &-image {
        height: 100px;
        width: 100px;
        margin-bottom: 8px;
      }

      &-text {
        text-align: center;
      }
    }

    &__edit-child {
      font-size: 14px;
      align-self: flex-end;
      padding: 0 0 0 5px;
    }
  }
</style>

