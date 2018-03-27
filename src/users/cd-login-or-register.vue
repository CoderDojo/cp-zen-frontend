<template>
  <div class="cd-login-or-register">
    <createAccount :eventId="eventId" ref="bookingCreateAccountRef"></createAccount>
    <div class="cd-login-or-register__login">
      <redirectToLogin :url="redirectionUrl"></redirectToLogin>
    </div>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import UsersUtil from '@/users/util';
  import EventService from '@/events/service';
  import CreateAccount from '@/users/cd-create-account';
  import RedirectToLogin from '@/users/cd-redirect-to-login';


  export default {
    name: 'LoginOrRegister',
    props: ['eventId'],
    components: {
      CreateAccount,
      RedirectToLogin,
    },
    data() {
      return {
        eventDetails: {},
        isDobUnderage: false,
        date: null,
      };
    },
    methods: {
      loadEvent() {
        EventService.loadEvent(this.eventId)
          .then((response) => {
            this.eventDetails = response.body;
          });
      },
      next() {
        this.isDobUnderage = UsersUtil.isUnderAge(this.date);
        if (this.isDobUnderage) {
          return;
        }
        StoreService.save('selected-event', this.eventDetails);
        StoreService.save('applicant-dob', this.date);
        this.$router.push({ name: 'EventSessions', params: { eventId: this.eventId } });
      },
    },
    computed: {
      redirectionUrl() {
        return `/events/${this.eventId}`;
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
<style scoped lang="less">
  .cd-login-or-register {
    &__verify-age-message {
      display: block;
      margin-bottom: 30px;
      font-size: 24px;
      margin-top: 45px;
      font-weight: bold;
    }
    &__verify {
      margin-top: 60px;
      width: 197px;
      height: 46px;
      font-size: 16px;
      font-weight: bold;
    }
    &__login {
      width: 100%;
    }
    &__cancel {
      margin-top: 60px;
      margin-right: 18.9px;
      width: 100px;
      height: 46px;
      color: #337ab7;
      background-color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }
    &__dob-picker-wrapper {
      max-width: 35%;
    }
  }
</style>
