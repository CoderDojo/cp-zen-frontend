<template>
  <div class="column">
    <div v-if="isDisplayable" class="cd-dashboard-children">
      <h2 class="cd-dashboard-children__header">{{ $t('My children') }}</h2>
      <hr class ="cd-dashboard-children__divider visible-xs">
      <div class="cd-dashboard-children__child" v-for="child in children.slice(0,3)">
        <h4 class="cd-dashboard-children__name">
          {{ child.name }}
        </h4>
        <span class="cd-dashboard-children__badges" v-if="child.badges.length > 0" >
          <div class="cd-dashboard-children__badge" v-for="badge in child.badges.slice(0,3)">
            <img class="cd-dashboard-children__badge-image" :src="badge.imageUrl" />
          </div>
          <a :href="`/dashboard/children/${child.userId}`" class="cd-dashboard-children__badges-link" v-if="child.badges.length > 2" v-ga-track-click="'view_badges'">{{ $t('See all {badgesAmount} badges', {badgesAmount: child.badges.length}) }}</a>
        </span>
        <p class="cd-dashboard-children__badges-none" v-else>{{ $t('{name} doesn\'t have any badges yet.', { name: child.firstName }) }}
        {{ $t('Talk to the organisers of your Dojo to learn how {name} can be rewarded through badges.', { name: child.firstName }) }}</p>
      </div>
      <div class="cd-dashboard-children__cta">
        <a class="cd-dashboard-children__view-all" href="/dashboard/children/" v-ga-track-click="'view_children'">{{ $t('View my children') }}</a>
      </div>
    </div>
    <div v-else class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">{{ $t('My children') }}</h1>
      <div class="cd-dashboard-children__child cd-filler cd-filler--grey-bg">
        <h3 class="cd-dashboard-children__name cd-dashboard-children__name--filler"></h3>
        <span class="cd-dashboard-children__badges cd-dashboard-children__badges--filler"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import UserService from '@/users/service';
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: 'cd-dashboard-children',
    props: ['userProfile'],
    data() {
      return {
        loadedChildren: false,
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
      hasChildren() {
        return (this.userChildren && this.userChildren.length > 0);
      },
      isDisplayable() {
        return this.hasChildren && this.loadedChildren;
      },
    },
    methods: {
      orderedBadges(userBadges) {
        const badges = userBadges || [];
        return badges.sort((a, b) => moment(a.dateAccepted).isBefore(moment(b.dateAccepted)));
      },
      async loadChildren() {
        this.userChildren = (await Promise.all(
          this.userProfile.children.map(
            child => UserService.userProfileData(child))))
          .map(res => ({
            ...res.body,
            badges: this.orderedBadges(res.body.badges),
          }));
        this.loadedChildren = true;
      },
    },
    async created() {
      await this.loadChildren();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-filler-loading";
  @import "../common/variables";

  .cd-dashboard-children {
    background-color: @side-column-grey;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    max-width: 340px;

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

      &-link {
        margin: 16px 0 0;
      }

      &-none {
        white-space: pre-line;
      }

      &--filler {
        background-color: @cd-very-light-grey;
        height: 150px;
      }
    }

    &__badge {
      width: 72px;
      height: 100%;
      text-align: center;
      align-items: center;

      &-image {
        height: 72px;
        width: 100%;
        object-fit: contain;
      }
    }

    &__cta {
      text-align: center;
    }

    &__view-all {
      font-size: @font-size-medium;
      font-weight: bold;
      text-decoration: underline;
      padding: 14px;
      display: inline-block;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-children {
      max-width: 100%;

      &__divider {
        border-color: @divider-grey;
      }

      &__badge {
        width: 72px;
        height: 100%;
        align-items: center;

        &-image {
          height: 72px;
          width: 100%;
          object-fit: contain;
        }
      }
    }
  }
</style>

