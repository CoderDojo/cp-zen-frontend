<template>
  <div class="cd-login container-fluid">
    <div class="row">
      <h3 class="cd-login__header text-center">{{ $t('Login') }}</h3>
    </div>
    <div v-show="passwordReset" class="row">
      <p class="text-center text-success">
        <strong>
          {{ $t('Successfully updated password') }}
        </strong>
      </p>
    </div>
    <div class="row">
      <div class="cd-login__box">
        <span v-show="errors.first('loginFailed') !== 'raspberry-linked'">
          <form @submit.prevent="login">
            <div class="form-group">
              <label>{{ $t('Email') }}</label>
              <input class="form-control" data-vv-name="email" data-vv-validate-on="blur" type="email" v-model="email" v-validate="'required|email'" novalidate/>
            </div>
            <p class="cd-login__email-req-err text-danger" v-show="errors.has('email:required')">{{ $t('Email is required') }}</p>
            <p class="cd-login__email-format-err text-danger" v-show="errors.has('email:email')">{{ $t('Email should be in the format: janedoe@example.com') }}</p>
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" data-vv-name="password" data-vv-validate-on="blur" type="password" v-model="password" v-validate="'required'" />
            </div>
            <p class="cd-login__password-req-err text-danger" v-show="errors.has('password:required')">{{ $t('Password is required') }}</p>
            <input class="cd-login__button btn btn-primary" type="submit" value="Login" />
          </form>
          <p v-show="errors.has('loginFailed')" class="cd-login__login-failed text-danger">{{ $t('There was a problem logging in: {msg}', {msg: $t('Invalid email or password') }) }}</p>
          <p class="cd-login__forgot-password"><a href="/reset">{{ $t('Forgot password?') }}</a></p>
          <p class="cd-login__register">{{ $t("Don't have an account?") }} <a :href="registerUrl">{{ $t('Register here') }}</a></p>
        </span>
        <span v-show="errors.first('loginFailed') === 'raspberry-linked'" class="cd-login__raspberry-linked">
          <p>
            {{ $t('The account for email {msg} is linked to a My Raspberry Pi account.', { msg: email }) }}
          </p>
          <p>
            <a :href="`/rpi/login?user=${email}`">{{$t('Login through My Raspberry Pi.')}}</a>
          </p>
          <p>
            <a href='#' v-on:click.prevent="resetForm()" >{{$t('Use different Coder Dojo account.')}}</a>
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import store from '@/store';
  import { mapGetters } from 'vuex';
  import UserService from './service';

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    store,
    computed: {
      redirectUrl() {
        return this.referer || '/';
      },
      referer() {
        return this.$route.query.referer || this.$route.query.referrer;
      },
      registerUrl() {
        let url = '/register';
        url += this.referer ? `?referer=${this.referer}` : '';
        return url;
      },
      passwordReset() {
        if (this.$route.query.pwr) {
          return true;
        }
        return false;
      },
      ...mapGetters(['isLoggedIn']),
    },
    methods: {
      async validateForm() {
        return this.$validator.validateAll();
      },
      resetForm() {
        this.email = '';
        this.password = '';
        if (this.errors && this.errors.clear) {
          this.errors.clear();
        }
      },
      redirectTo(url) {
        location.href = url;
      },
      async login() {
        const valid = await this.validateForm();
        if (valid) {
          const response = await UserService.login(this.email, this.password);
          if (this.errors && this.errors.clear) {
            this.errors.clear();
          }
          if (response.body.ok === false) {
            this.errors.add({
              field: 'loginFailed',
              msg: response.body.why });
          } else {
            const forumUrl = `^${Vue.config.forumsUrlBase}/auth/CoderDojo$`;
            if (this.redirectUrl.match(forumUrl)) {
              this.redirectTo(this.redirectUrl);
              return;
            }
            this.$router.push(this.redirectUrl);
          }
        }
      },
    },
    async created() {
      if (this.isLoggedIn) return this.$router.replace(this.redirectUrl);
      return undefined;
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";

  .cd-login {
    &__header {
      padding: 24px;
    }
    &__box {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 32px 56px 56px;
      max-width: 425px;
      margin: 20px auto 128px;
    }

    &__button {
      .primary-button;
      margin-bottom: 48px;
    }

    &__raspberry-linked {
      display: block;
    }
  }
</style>
