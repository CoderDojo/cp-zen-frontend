<template>
  <div class="cd-login-or-register">
    <createAccount ref="bookingCreateAccountRef" :context="context" @registered="next()"></createAccount>
    <div class="cd-login-or-register__login">
      <redirectToLogin :url="redirectionUrl"></redirectToLogin>
    </div>
  </div>
</template>
<script>
  import EventService from '@/events/service';
  import UserService from '@/users/service';
  import DojoService from '@/dojos/service';
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
        currentUser: null,
        eventDetails: {},
        dojoDetails: {},
      };
    },
    methods: {
      async loadEvent() {
        this.eventDetails = (await EventService.loadEvent(this.eventId)).body;
      },
      async loadDojo() {
        this.dojoDetails = (await DojoService.getDojoById(this.eventDetails.dojoId)).body;
      },
      async loadCurrentUser() {
        this.currentUser = (await UserService.getCurrentUser()).body;
      },
      next() {
        this.$router.push({ name: 'EventSessions', params: { eventId: this.eventId } });
      },
    },
    computed: {
      redirectionUrl() {
        return this.$route.path;
      },
      context() {
        return {
          country: this.dojoDetails.country,
        };
      },
    },
    async created() {
      await this.loadCurrentUser();
      if (this.currentUser) {
        return this.next();
      }
      await this.loadEvent();
      this.loadDojo();
    },
  };
</script>
<style scoped lang="less">
  .cd-login-or-register {
    &__login {
      width: 100%;
    }
  }
</style>
