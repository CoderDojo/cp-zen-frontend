<template>
  <div class="cd-manage-request-to-join">
    <div class="circle-loader" :class="{ 'circle-loader--done': ready }" v-if="loaderIsVisible">
      <div class="checkmark draw" :class="{ 'checkmark--visible': ready }"></div>
    </div>
    <h1>{{ $t(text) }}</h1>
    <h2 v-if="errorText" v-html="$t(errorText, { openLink: `<a href='/dashboard/my-dojos/${membershipRequest.dojoId}/users'>`, closeLink: '</a>'})"></h2>
  </div>
</template>
<script>
  import DojosService from '@/dojos/service';

  export default {
    name: 'manage-request-to-join',
    props: [],
    data() {
      return {
        status: null,
        dojoId: null,
        requestId: null,
        loaderIsVisible: true,
        errorText: '',
        membershipRequest: null,
        ready: false,
      };
    },
    computed: {
      userTypeString() {
        return this.membershipRequest.userType === 'mentor' ? 'The user is now a mentor for your Dojo. This means they can now book mentor tickets and check in users to your events.' : 'The user is now a champion for your Dojo. This means they can now create events, modify the Dojo page and award badges.';
      },
      text() {
        /* eslint-disable no-nested-ternary */
        return this.status === 'accept' && this.loaderIsVisible ?
          (this.ready ? this.userTypeString : 'Accepting the user...') :
            (this.status === 'refuse' && this.loaderIsVisible ?
              (this.ready ? 'The request to join your Dojo has been refused.' : 'Refusing this user from joining your Dojo...') :
                'Invalid action, try again or contact support.');
        /* eslint-enable no-nested-ternary */
      },
    },
    methods: {
      onError() {
        this.loaderIsVisible = false;
      },
      async loadMembershipRequest() {
        try {
          this.membershipRequest = (await DojosService.membership.loadPending(
            this.requestId,
            this.dojoId,
          )).body;
        } catch (e) {
          this.onError();
        }
      },
      async actOnMembershipRequest() {
        try {
          if (this.status === 'accept') {
            await DojosService.membership.accept(this.requestId, this.membershipRequest.dojoId);
            this.ready = true;
          } else if (this.status === 'refuse') {
            await DojosService.membership.refuse(this.requestId, this.membershipRequest.dojoId);
            this.ready = true;
          } else {
            // Unexpected scenario
            this.onError();
          }
        } catch (e) {
          // Conflict on the creation of the user: we recommend using another path
          if (e.status === 400) {
            this.errorText = 'This user is already part of your Dojo, please go to your {openLink}Dojo\'s user management page{closeLink} to change the user\'s role.';
          }
          this.onError();
        }
      },
    },
    async created() {
      Object.assign(this, this.$route.params);
      await this.loadMembershipRequest();
      if (this.membershipRequest) {
        await this.actOnMembershipRequest();
      } else {
        // membership not found
        this.onError();
      }
    },
  };
</script>
<style lang="less" scoped>
  .cd-manage-request-to-join {
    text-align: center;
    padding: 16px;
  }
  /* Credit to https://codepen.io/scottloway/pen/zqoLyQ */
  @brand-success: #5cb85c;
  @loader-size: 7em;
  @check-thickness: 0.5em;
  @loader-thickness: @check-thickness/2; 
  @check-height: @loader-size/2;
  @check-width: @check-height/2;
  @check-left: (@loader-size/6 + @loader-size/12 - @check-thickness/2);
  @check-color: @brand-success;

  .circle-loader {
    margin-bottom: @loader-size/2;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left-color: @check-color;
    animation: loader-spin 1.2s infinite linear;
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    border-width: @loader-thickness;
    width: @loader-size;
    height: @loader-size;
    &--done {
      -webkit-animation: none;
      animation: none;
      border-color: @check-color;
      transition: border 500ms ease-out;
    }
  }


  .checkmark {
    display: none;
    &--visible {
      display: block;
    } 
    &.draw:after {
      animation-duration: 800ms;
      animation-timing-function: ease;
      animation-name: checkmark;
      transform: scaleX(-1) rotate(135deg);
    }
    
    &:after {
      opacity: 1;
      height: @check-height;
      width: @check-width;
      transform-origin: left top;
      border-right: @check-thickness solid @check-color;
      border-top: @check-thickness solid @check-color;
      content: '';
      left: @check-left;
      top: @check-height;
      position: absolute;
    }
  }

  @keyframes loader-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes checkmark {
    0% {
      height: 0;
      width: 0;
      opacity: 1;
    }
    20% {
      height: 0;
      width: @check-width;
      opacity: 1;
    }
    40% {
      height: @check-height;
      width: @check-width;
      opacity: 1;
    }
    100% {
      height: @check-height;
      width: @check-width;
      opacity: 1;
    }
  }
</style>
