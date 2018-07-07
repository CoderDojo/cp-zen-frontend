<template>
  <div v-show="!confirmed" class="cd-cookie-notice">
    <span v-html="$t('By using this website you agree to the use of cookies. You can read about our cookie policy <a href=\'/privacy-statement#cookies\'>here</a>.')"></span>
    <i class="fa fa-times-circle cd-cookie-notice__dismiss" aria-label="Dismiss" @click="dismissNotice"></i>
  </div>
</template>

<script>
  import Cookie from 'js-cookie';

  export default {
    name: 'CookieNotice',
    data() {
      return {
        confirmed: false,
      };
    },
    methods: {
      dismissNotice() {
        this.confirmed = true;
        Cookie.set('cookieDisclaimer', 'confirmed');
        // Won't hide the element first if we destroy it immediately
        this.$nextTick(() => {
          this.$destroy();
        });
      },
    },
    watch: {
      $route(newVal, oldVal) {
        if (newVal.fullPath !== oldVal.fullPath) {
          this.dismissNotice();
        }
      },
    },
    created() {
      if (Cookie.get('cookieDisclaimer') === 'confirmed') {
        this.dismissNotice();
      }
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
