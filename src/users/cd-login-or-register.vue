<template>
  <div class="cd-login-or-register">
    <createAccount ref="bookingCreateAccountRef" :context="context" @registered="next()"></createAccount>
    <div class="cd-login-or-register__login">
      <redirectToLogin :url="redirectionUrl"></redirectToLogin>
    </div>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import EventService from '@/events/service';
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
      next() {
        StoreService.save('selected-event', this.eventDetails);
        this.$router.push({ name: 'EventSessions', params: { eventId: this.eventId } });
      },
    },
    computed: {
      redirectionUrl() {
        return `/events/${this.eventId}`;
      },
      context() {
        return {
          country: this.dojoDetails.country,
        };
      },
    },
    async created() {
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
