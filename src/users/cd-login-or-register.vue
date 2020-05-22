<template>
  <div v-if="isLoggedIn === false" class="cd-login-or-register">
    <createAccount ref="bookingCreateAccountRef" :context="context" @registered="next()"></createAccount>
    <div class="cd-login-or-register__login">
      <redirectToLogin :url="redirectionUrl"></redirectToLogin>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import CreateAccount from '@/users/cd-create-account';
  import RedirectToLogin from '@/users/cd-redirect-to-login';
  import store from '@/store';

  export default {
    name: 'LoginOrRegister',
    store,
    props: ['eventId'],
    components: {
      CreateAccount,
      RedirectToLogin,
    },
    methods: {
      checkIsLoggedIn() {
        if (this.isLoggedIn) {
          this.next();
        }
      },
      next() {
        this.$router.push({ name: 'EventSessions', params: { eventId: this.eventId } });
      },
    },
    computed: {
      ...mapGetters('order', ['event']),
      ...mapGetters(['isLoggedIn', 'dojo']),
      redirectionUrl() {
        return this.$route.path;
      },
      context() {
        return {
          country: this.dojo.country,
        };
      },
    },
    watch: {
      isLoggedIn() {
        this.checkIsLoggedIn();
      },
    },
    created() {
      this.checkIsLoggedIn();
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
