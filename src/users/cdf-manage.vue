<template>
  <div class="cdf-users container-fluid">
    <div class="row">
      <h2 class="cdf-users__header text-center">{{ $t('Delete Users') }}</h2>
    </div>
    <div class="row">
      <div class="cdf-users alert alert-danger">
        <p class="text-bold">⚠️  Any manipulation is done in full understanding and will NOT be recovered by the webteam</p>
      </div>
      <div class="cdf-users__box">
        <form @submit.prevent="searchUser">
          <div class="form-group" v-if="!userId">
            <label>{{ $t('Email') }}</label>
            <input class="form-control" data-vv-name="email" data-vv-validate-on="blur" type="email" v-model="email" v-validate="'required|email'" novalidate/>
          </div>
          <div class="form-group" v-if="userId">
            <label>{{ $t('User Id') }}</label>
            <input class="form-control" type="text" v-model="userId" disabled=true/>
          </div>

          <input class="cdf-users__button btn btn-primary" type="submit" value="Search" v-if="!userId"></input>
          <p class="cdf-users__email-req-err text-danger" v-show="errors.has('email:required')">{{ $t('Email is required') }}</p>
          <p class="cdf-users__email-format-err text-danger" v-show="errors.has('email:email')">{{ $t('Email should be in the format: janedoe@example.com') }}</p>
          <p class="cdf-users__email-not-found-err text-danger" v-show="errors.has('userNotFound')">{{ $t('User not found') }}</p>
        </form>
      </div>
      <div class="cdf-users__box">
        <h3>User infos</h3>
        <div v-if="deleted" class="cdf-users__box-confirmation">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/8_LcH-Lwlxs?rel=0&amp;showinfo=0&amp;autoplay=1&amp;start=12" frameborder="0"></iframe>
        </div>
        <p>Any information displayed here will be affected by the action you'll trigger</p>
        <div v-if="user.id">
          <h4 class="cdf-users__user-name">{{ user.name }}</h4>
          <p class="cdf-users__user-type">User type: {{ user.profile.userType }}</p>
          <h4>Children</h4>
          <div v-if="children.length">
            <div v-for="child in children" class="cdf-users__child">
              <i class="fa fa-check text-success" v-if="child.userType === 'attendee-u13'"></i>
              <i class="fa fa-exclamation text-warning" v-if="child.userType === 'attendee-o13'"></i>
              <span>{{ child.name }} - {{ child.userType }}</span>
              <router-link :to="{name: 'CDFUsersManagement', query: { userId: child.userId }}" class="cdf-users__child-link">Load this user<span v-if="child.userType === 'attendee-o13'"> and review their forum account</span></router-link>
            </div>
          </div>
          <div v-else class="cdf-users__no-children">No children found</div>
          <h4>Important roles</h4>
          <div v-for="membership in memberships" v-if="memberships.length && dojos.length">
            <div v-if="isDojoOwnerOf(membership)" class="cdf-users__role-owner">
              <i class="fa fa-exclamation text-danger"></i>User is dojo owner of <router-link :to="{ name: 'DojoDetailsId', params: { id: membership.dojoId } }">{{ getDojo(membership.dojoId).name }}</router-link></div>
            <div v-if="isChampionOf(membership)" class="cdf-users__role-champion">
              <i class="fa fa-warning text-warning"></i>User is champion of <router-link :to="{ name: 'DojoDetailsId', params: { id: membership.dojoId } }">{{ getDojo(membership.dojoId).name }}</router-link></div>
          </div>
          <p class="cdf-users__forum-not-found" v-if="user.id && !forumUser.uid">
            <i class="fa fa-check text-success"></i>
            User not found on the forum
          </p>
          <a :href="userProfileForumUrl" v-if="user.id && forumUser.uid" class="cdf-users__forum-link">
            <i class="fa fa-exclamation text-danger"></i>User found on the forum, please delete there first
          </a>
        </div>
        <div v-else>
          <h3 class="cdf-users__no-info">No info available</h3>
        </div>
        <p class="cdf-users__email-api-err text-danger" v-show="errors.has('deletionFailed')">{{ $t('Something went wrong, please contact the webteam') }}</p>
        <div class="cdf-users__buttons">
          <input class="cdf-users__button cdf-users__button--anonymize btn btn-warning" type="button" value="Anonymize" :disabled="!user.id || isDojoOwner" @click="deleteUser(1)"/>
          <span class="cdf-users__email-owner-err text-danger" v-if="isDojoOwner">Can't delete a dojo owner</span>
          <input class="cdf-users__button cdf-users__button--delete btn btn-danger" type="button" value="Delete" :disabled="!user.id || isDojoOwner" @click="deleteUser()"/>
        </div>
     </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import store from '@/store';
  import DojoService from '@/dojos/service';
  import ForumService from '@/forum/service';
  import { mapGetters } from 'vuex';
  import UserService from './service';

  export default {
    name: 'CDFManageUsers',
    data() {
      return {
        email: '',
        user: {},
        userId: '',
        children: [],
        memberships: [],
        forumUser: {},
        dojos: [],
        deleted: false,
      };
    },
    store,
    computed: {
      ...mapGetters(['isLoggedIn']),
      isDojoOwner() {
        return (this.memberships.filter(this.isDojoOwnerOf)).length > 0;
      },
      userProfileForumUrl() {
        return `${Vue.config.forumsUrlBase}/user/${this.forumUser.userslug}/settings`;
      },
    },
    methods: {
      getDojo(dojoId) {
        return this.dojos.find(dojo => dojo.id === dojoId);
      },
      isDojoOwnerOf(membership) {
        return !!membership.owner;
      },
      isChampionOf(membership) {
        return membership.userTypes.indexOf('champion') > -1;
      },
      searchUser() {
        return this.$router.push({ name: 'CDFUsersManagement', query: { email: this.email } });
      },
      async getUserInfos() {
        this.errors.clear();
        this.reset();
        try {
          if (this.email && this.email.length > 0) {
            this.user = (await UserService.search({ email: this.email, related: 'profile' })).body;
          } else if (this.userId && this.userId.length > 0) {
            this.user = (await UserService.load(this.userId, { related: 'profile' })).body;
          }
          await Promise.all([
            UserService.getChildren(this.user.id),
            (async () => {
              this.memberships = (await DojoService.getUsersDojos(this.user.id)).body;
              return Promise.all(this.memberships.map(d =>
                DojoService.getDojoById(d.dojoId)));
            })(),
          ]).then((res) => {
            this.children = res[0].body;
            this.dojos = res[1].map(resp => resp.body);
          })
          // Split this function from the promise.all : CORS errors are hard to catch
          .then((async () => {
            if (this.user.email) {
              // TODO : once the forum integration is done back-end wise
              // we can fully automate from there
              try {
                this.forumUser = (await ForumService.user.search(this.user.email)).body;
              } catch (e) {
                // You might not have the forums running in development; and that's fine
                this.errors.add('forumUserNotFound', 'User not found');
              }
            }
          })());
        } catch (e) {
          if (e.status === 404 && e.body.message === '404 - "Invalid userId"') {
            this.errors.add('userNotFound', e.body.message);
          }
        }
      },
      async deleteUser(soft) {
        this.errors.clear();
        // eslint-disable-next-line no-alert
        if (window.confirm(`Are you 100% sure you know what you are about to do to this poor ${this.user.name} ?`)) {
          try {
            await UserService.delete(this.user.id, !!soft);
            this.deleted = true;
          } catch (e) {
            this.errors.add('deletionFailed', 'Something went absolutly wrong');
          }
        }
      },
      reset() {
        this.user = {};
        this.children = [];
        this.dojos = [];
        this.memberships = [];
        this.deleted = false;
      },
    },
    async created() {
      this.reset();
      if (!this.isLoggedIn) return this.$router.replace('/cdf');
      if (this.$route.query.email) {
        this.email = this.$route.query.email;
        return this.getUserInfos();
      } else if (this.$route.query.userId) {
        this.userId = this.$route.query.userId;
        return this.getUserInfos();
      }
      return Promise.resolve();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";

  .cdf-users {
    & .fa {
      width: 20px;
      text-align: center;
    }
    &__header {
      padding: 24px;
    }
    &__child-link {
      margin-left: 6px;
    }
    &__box {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 24px;
      margin-bottom: 16px;
      &-confirmation {
        text-align: center;
      }
    }
    &__no-info {
      text-align: center;
    }
    &__buttons {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      &__button {
        .primary-button;
        margin-bottom: 8px;
        margin-top: 8px;
        &--delete{
          float: right;
        }
      }
    }
  }
</style>
