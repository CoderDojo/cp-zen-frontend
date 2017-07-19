<template>
  <div v-show="!confirmed" class="cd-cookie-notice">
    <span v-html="$t('By using this website you agree to the use of cookies. You can read about our cookie policy <a href=\'/privacy-statement#cookies\'>here</a>.')"></span>
    <i class="fa fa-times-circle cd-cookie-notice__dismiss" aria-label="Dismiss" @click="confirmed = true"></i>
  </div>
</template>

<script>
  import Cookie from 'js-cookie';

  export default {
    name: 'CookieNotice',
    data() {
      return {
        confirmed: null,
      };
    },
    watch: {
      $route() {
        if (!this.confirmed) this.confirmed = true;
      },
      confirmed(val) {
        if (val) Cookie.set('cookieDisclaimer', 'confirmed');
      },
    },
    created() {
      this.confirmed = (Cookie.get('cookieDisclaimer') === 'confirmed');
    },
  };
</script>

<style lang="less" scoped>
  @import "./variables";

  .cd-cookie-notice {
    position: sticky;
    bottom: 0;
    z-index: 9999;
    background: @cd-alt-white;
    padding: @grid-gutter-width/4 @grid-gutter-width/2;
    margin: 0 @grid-gutter-width/-2;
    text-align: center;

    &__dismiss {
      margin-left: @grid-gutter-width/8;
      cursor: pointer;
    }
  }
</style>
