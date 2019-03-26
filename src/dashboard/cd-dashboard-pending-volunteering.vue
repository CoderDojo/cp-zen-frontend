<template>
  <div class="cd-dashboard-pending-requests">
    <div :class="[index === (dojos.length -1) && infoIsDisplayed ? 'cd-dashboard-pending-requests__request--last': '', 'cd-dashboard-pending-requests__request']" v-for="(dojo, index) in dojos">
      <i class="fa fa-hourglass-half"></i>
      <h4 class="cd-dashboard-pending-requests__request-title" v-html="$t('You have a pending join request for <a href=\'/dojos/{slug}\'>{name}</a>.', { name: dojo.name, slug: dojo.urlSlug })"/>
        <p>{{ $t('If the Dojo does not reply/accept within a few days, we suggest you try another club or contacting support.') }}</p>
    </div>
    <div class="cd-dashboard-pending-requests__info" v-if="infoIsDisplayed">
      {{ $t('In the meantime, volunteers often like to complete some of the following.') }}
      <ul>
        <li><a href="https://www.raspberrypi.org/safeguarding/e-learning-module/">{{ $t('Do our safeguarding module') }}</a></li>
        <li><a href="https://help.coderdojo.com/hc/en-us/articles/360000674903-Setting-up-and-running-a-Dojo-a-CoderDojo-guide">{{ $t('Look at our guide to mentoring') }}</a></li>
        <li><a href="https://projects.raspberrypi.org/org/coderdojo">{{ $t('Check out some projects you like') }}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import DojosService from '@/dojos/service';

  export default {
    name: 'cd-dashboard-pending-requests',
    props: ['requestsToJoin', 'userIsNew'],
    data() {
      return {
        dojos: [],
      };
    },
    computed: {
      recentRequestsToJoin() {
        return this.requestsToJoin.filter(r => moment().diff(r.timestamp, 'days') < 30);
      },
      infoIsDisplayed() {
        return this.userIsNew && this.recentRequestsToJoin.length > 0;
      },
    },
    async created() {
      this.dojos = (await DojosService.getDojos({
        id: {
          in$: this.recentRequestsToJoin.map(r => r.dojoId),
        },
      })).body;
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/variables";

  .cd-dashboard-pending-requests {
    margin: 32px 0;
    display: flex;
    flex-direction: column;
    &__request, &__info {
      background: @cd-white;
      padding: 20px; 
    }
    &__request {
      margin: @margin 0; 
      & > .fa {
        padding-right: @margin;
        font-size: 1.2em;
      }
      &-title {
        display: inline-block;
      }
      &--last {
        margin: 0;
        border-bottom: @cd-very-light-grey 10px solid;
      }
    }
  }
</style>
