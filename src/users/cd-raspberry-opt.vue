<template>
  <div class="cd-auth-type container-fluid">
    <div class="row">
      <div class="cd-auth-type__box">
        <span v-if="rpiAuthFlag">
          <h3
            class="cd-auth-type__header"
          >{{ $t("This browser is opted in to My Raspberry Pi authentication.") }}</h3>
          <div class="form-group text-center">
            <button class="cd-auth-type__opt btn btn-primary" v-on:click="optOut">Opt Out</button>
          <div>
        </span>
        <span v-else>
          <h3
            class="cd-auth-type__header"
          >{{ $t("This browser is opted out of My Raspberry Pi authentication.") }}</h3>
          <div class="form-group text-center">
            <button class="cd-auth-type__opt btn btn-primary" v-on:click="optIn">Opt In</button>
          <div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'Auth-Type',
  created() {
    if (this.$route.query.optIn) {
      const rpiAuthFlag = window.localStorage.getItem('rpiAuth') === 'true';
      if (!rpiAuthFlag) {
        this.optIn();
      }
    }
  },
  data() {
    return {
      rpiAuthFlag: window.localStorage.getItem('rpiAuth') === 'true',
    };
  },
  store,
  methods: {
    optIn() {
      window.localStorage.setItem('rpiAuth', true);
      location.reload();
    },
    optOut() {
      window.localStorage.clear('rpiAuth');
      // reload and clear optIn query param
      location.href = location.href.split('?')[0];
    },
  },
};
</script>

<style scoped lang="less">
@import "~@coderdojo/cd-common/common/_colors";
@import "../common/styles/cd-primary-button.less";

.cd-auth-type {
  &__header {
    padding: 12px;
  }
  &__box {
    border-style: solid;
    border-color: @cd-orange;
    border-width: 1px 1px 3px 1px;
    padding: 32px 56px 56px;
    max-width: 425px;
    margin: 20px auto 128px;
  }

  &__opt {
    .primary-button;
  }
}
</style>
