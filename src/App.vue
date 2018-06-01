<template>
  <div id="app">
    <cd-header></cd-header>
    <div class="cd-menu__content-container">
      <router-view></router-view>
      <cd-cookie-notice></cd-cookie-notice>
    </div>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
  import store from './store';
  import cdHeader from './common/cd-header';
  import cdFooter from './common/cd-footer';
  import cdCookieNotice from './common/cd-cookie-notice';

  export default {
    name: 'app',
    store,
    components: {
      cdHeader,
      cdFooter,
      cdCookieNotice,
    },
    created() {
      this.$store.dispatch('getLoggedInUser');
    },
  };
</script>

<style lang="less" src="@/common/base.less"></style>
