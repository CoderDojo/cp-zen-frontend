<template>
  <div id="app">
    <cd-text-direction-wrapper>
      <cd-header></cd-header>
      <div class="cd-menu__content-container">
        <router-view></router-view>
        <cd-cookie-notice></cd-cookie-notice>
      </div>
      <cd-footer></cd-footer>
    </cd-text-direction-wrapper>
  </div>
</template>

<script>
  import store from './store';
  import cdHeader from './common/cd-header';
  import cdFooter from './common/cd-footer';
  import cdCookieNotice from './common/cd-cookie-notice';
  import cdTextDirectionWrapper from './common/cd-text-direction-wrapper';

  export default {
    name: 'app',
    store,
    components: {
      cdTextDirectionWrapper,
      cdHeader,
      cdFooter,
      cdCookieNotice,
    },
  };
</script>

<style lang="less" src="@/common/base.less"></style>
