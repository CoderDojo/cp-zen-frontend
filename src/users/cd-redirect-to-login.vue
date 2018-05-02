<template>
  <div class="cd-redirect-to-login">
    <p class="cd-redirect-to-login__heading">{{ $t('Have you booked an event before?') }}</p>
    <div>
      <router-link :to="login" class="btn btn-secondary cd-redirect-to-login__button">{{ $t('Log into your account') }}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RedirectToLogin',
    props: ['url'],
    computed: {
      login() {
        return {
          path: `/login?next=${this.url}`,
        };
      },
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-redirect-to-login {
    margin-top: 8px;
    padding: 18px;
    border: solid 1px @cd-orange;
    border-bottom: solid 2px @cd-orange;
    font-weight: 800;
    text-align: center;
    display: flex;
    flex-direction: column;
    &__heading {
      font-weight: bold;
    }
    &__button {
      border: solid 1px @cd-blue;
      border-radius: 3px;
    }
  }
</style>
