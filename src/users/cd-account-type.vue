<template>
  <div class="cd-account-type container-fluid">
    <div class="row">
      <h3 class="cd-account-type__header text-center">{{ $t('Account Type') }}</h3>
    </div>
    <div class="row">
      <div class="cd-account-type__box">
        <h4 class="cd-account-type__sub-header">{{ $t('Please select an account type to complete registration.') }}</h4>
        <form @submit.prevent="submit">
          <div class="form-group">
            <div>
              <input name="accountType" id="type-attendee" value="attendee" type="radio" v-model="accountType" v-validate.initial="'required'"/>
              <label for="type-attendee">{{ $t('Attendee') }}</label>
            </div>
            <div>
              <input name="accountType" id="type-guardian" value="guardian" type="radio" v-model="accountType"/>
              <label for="type-guardian">{{ $t('Parent/Guardian') }}</label>
            </div>
          </div>
          <input :disabled="errors.any()" class="cd-account-type__submit btn btn-primary" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue';
  import store from '@/store';

  export default {
    name: 'Account-Type',
    data() {
      return {
        accountType: '',
      };
    },
    store,
    methods: {
      redirectTo(url) {
        location.href = url;
      },
      submit() {
        this.redirectTo(`/rpi/cb?state=${this.$route.query.state}&type=${this.accountType}`);
      },
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";

  .cd-account-type {
    &__header {
      padding: 24px;
    }
    &__sub-header {
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

    &__submit {
      .primary-button;
    }

    input[type=radio] {
      margin: 0 3px;
    }

  }
</style>
