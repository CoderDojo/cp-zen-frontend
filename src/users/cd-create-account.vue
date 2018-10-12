<template>
  <form class="cd-create-account" @submit.prevent="register">
    <h1 class="cd-create-account__header">{{ $t('Please register your details so you can book Dojo events tickets') }}</h1>
    <div>
      <div class="cd-create-account__info">
        <p>
          <i class="fa fa-info-circle"></i>
          {{ $t('If you are a parent/guardian and want to book tickets for a child under 13, please fill in your own details.') }} <br/> 
          {{ $t('We collect this information so we can contact you with updates about the events you\'re booking tickets for.') }}
        </p>
      </div>
      <div>
        <label class="cd-create-account__label" for="email">{{ $t('Your email address') }}</label>
        <div class="cd-create-account__email">
         <input type="email" :placeholder="$t('Email address')" class="form-control" name="email" id="email" data-vv-name="email" v-validate="'required|email'" data-vv-validate-on="blur" v-model="userData.email">
       </div>
        <p class="cd-create-account-form__email-error text-danger" v-show="errors.has('email:required')">{{ $t('Email address is required') }}</p>
        <p class="cd-create-account-form__email-error text-danger" v-show="errors.has('email:email')">{{ $t('Email address is invalid') }}</p>
      </div>

      <label class="cd-create-account__label cd-create-account__names-label" for="firstName">{{ $t('Name') }}</label>
      <div class="cd-create-account__names" >
        <div class="cd-create-account__names-first" :class="{'cd-create-account__names--error': errors.has('lastName:required') && !errors.has('firstName:required')}">
          <input type="text" class="form-control" name="firstName" :placeholder="$t('First name')" id="name" data-vv-as="first name" v-validate="'required'" v-model="userData.firstName">
          <p class="cd-create-account-form__first-name-error text-danger" v-show="errors.has('firstName:required')" for="firstName">{{ $t('First name is required') }}</p>
        </div>
          <div class="cd-create-account__names-last" :class="{'cd-create-account__names--error': !errors.has('lastName:required') && errors.has('firstName:required')}">
          <input type="text" class="form-control" name="lastName" :placeholder="$t('Last name')" id="lastName" data-vv-as="last name" v-validate="'required'" v-model="userData.lastName">
          <p class="cd-create-account-form__last-name-error text-danger" v-show="errors.has('lastName:required')" for="lastName">{{ $t('Last name is required') }}</p>
        </div>
      </div>
      <div class="cd-create-account__dob">
        <label class="cd-create-account__label" for="dob">{{ $t('Enter your date of birth') }}</label>
        <div class="cd-create-account__dob-picker-wrapper">
          <vue-dob-picker v-model="dob" select-class="form-control cd-create-account__dob-picker-wrapper-select" id="dob" class="cd-create-account__dob-picker"
            v-validate="'required'"
            data-vv-name="dob"
            data-vv-value-path="value"
            data-vv-as="date of birth"
            show-labels="false" month-format="short"
            :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
            :proportions="[2, 2, 3]"></vue-dob-picker>
        </div>
        <p v-if="isUnderage" class="cd-create-account__dob-error text-danger">
          {{ $t('Sorry :( Since you are under 13, you\'re not yet allowed to book event tickets yourself.') }} 
          {{ $t('Please ask your parent or guardian to book for you.') }}
        </p>
        <p class="cd-create-account__dob-error text-danger"
          v-show="errors.has('dob:required')">{{ $t('Date of birth is required') }}</p>
      </div>
      <div>
        <label class="cd-create-account__label" for="password">{{ $t('Password') }}</label>
        <p class="cd-create-account__password-hint">
          {{ $t('Password must be at least eight characters, with at least one number.') }}
        </p>
        <span v-if="isPasswordVisible">
          <input type="text" class="form-control" placeholder="Password" name="password" id="password" data-vv-as="password"
               v-validate="'required|cd-password'" v-model="password"/>
        </span>
        <span v-else>
          <input type="password" class="form-control" placeholder="Password" name="password" id="password" data-vv-as="password"
               v-validate="'required|cd-password'" v-model="password"/>
        </span>
        <i class="fa cd-create-account__password-visibility" :class="isPasswordVisible ? 'fa-eye-slash': 'fa-eye' " @click="togglePasswordVisibility()"></i>
        <p class="text-danger cd-create-account__password-error"
               v-show="errors.has('password:required')">{{ $t('Password is required') }}</p>
        <p class="text-danger cd-create-account__password-error"
               v-show="errors.has('password:cd-password')">{{ $t('Password must be at least eight characters, with at least one number.') }}</p>
      </div>
      <div>
        <div class="cd-create-account__recaptcha">
          <vue-recaptcha :sitekey="recaptchaSiteKey" @verify="onRecaptchaVerify"></vue-recaptcha>
        </div>
      </div>

      <div>
        <div class="cd-create-account__agreement">
          <span class="cd-create-account__agreement-left">
            <input type="checkbox" name="isSubscribedToMailingList" v-model="isSubscribedToMailingList"/>
          </span>
          <span class="cd-create-account__agreement-right">
            <span>{{ $t('I want to join the CoderDojo mailing list') }}</span>
          </span>
        </div>
      </div>

      <div>
        <div class="cd-create-account__agreement">
          <span class="cd-create-account__agreement-left">
            <input type="checkbox" name="termsConditionsAccepted" v-validate="'required'"
                      v-model="termsConditionsAccepted"/>
          </span>
          <span class="cd-create-account__agreement-right">
            <span v-html="$t('I agree with the {openLinkTag}Terms & Conditions{closingLinkTag}', { openLinkTag: '<a class=\'cd-create-account__terms-conditions-link\' href=\'https://zen.coderdojo.com/terms-and-conditions\'>', closingLinkTag: '</a>' })"></span>
          </span>
        </div>
        <p class="text-danger cd-create-account__terms-conditions-error"
               v-show="errors.has('termsConditionsAccepted')">
            {{ $t('You must accept the terms and conditions before proceeding.') }}
        </p>
        <button type="submit" name="registration" class="cd-create-account__submit btn btn-primary" v-validate="'nick-exists'" v-ga-track-click="'attempt_register'" :disabled="submitting">
          {{ $t('Next') }}
          <span v-show="submitting"><i class="fa fa-spinner fa-spin"></i></span>
        </button>
        <p class="cd-create-account__errors text-danger" v-show="errors.has('registration')">{{ $t('A user already exists for this email.') }} {{ $t('Login to your account to continue.') }}</p>
      </div>
    </div>
  </form>
</template>
<script>
  import { extend } from 'lodash';
  import VueRecaptcha from 'vue-recaptcha';
  import VueDobPicker from 'vue-dob-picker';
  import UserService from '@/users/service';
  import UserUtils from '@/users/util';
  import OrderStore from '@/events/order/order-store';

  export default {
    name: 'BookingCreateAccount',
    props: ['context'],
    components: {
      VueRecaptcha,
      VueDobPicker,
    },
    data() {
      return {
        userData: {
          email: null,
          firstName: null,
          lastName: null,
        },
        dob: null,
        password: null,
        termConditionsAccepted: null,
        isSubscribedToMailingList: false,
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
        recaptchaResponse: null,
        isPasswordVisible: false,
        submitting: false,
      };
    },
    computed: {
      user() {
        return extend({}, this.userData, {
          password: this.password,
          'g-recaptcha-response': this.recaptchaResponse,
          initUserType: {
            title: 'Parent/Guardian',
            name: 'parent-guardian',
          },
          termsConditionsAccepted: this.termsConditionsAccepted,
          mailingList: this.isSubscribedToMailingList,
          emailSubject: 'Welcome to Zen, the CoderDojo community platform.',
        });
      },
      isUnderage() {
        return UserUtils.isUnderAge(this.dob);
      },
    },
    methods: {
      async validateForm() {
        if (this.isUnderage) {
          return false;
        }
        if (!this.recaptchaResponse) {
          alert('Please complete the reCAPTCHA');
          return false;
        }
        try {
          const res = await this.$validator.validateAll();
          return res;
        } catch (e) {
          return false;
        }
      },
      async register() {
        const ready = await this.validateForm();
        if (ready) {
          this.submitting = true;
          const isAdult = UserUtils.getAge(new Date(this.dob)) > 18;
          const context = this.context;
          try {
            await UserService.register(
              this.user,
              { dob: this.dob, ...context },
            );
            this.$ga.event(this.$route.name, 'click', `register_${isAdult ? 'adult' : 'kid'}`);
            OrderStore.commit('setIsNewUser', true);
            this.$emit('registered');
            this.submitting = false;
          } catch (err) {
            this.submitting = false;
            if (err.message === 'nick-exists') {
              this.errors.add('registration', 'Nick exists', 'nick-exists');
              return;
            }
            alert(err);
          }
        }
      },
      onRecaptchaVerify(response) {
        this.recaptchaResponse = response;
      },
      togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
      },
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";
  @import "../common/styles/cd-primary-button";

  .cd-create-account {
    margin-right: 33px;
    margin-top: 50px;
    &__recaptcha{
      margin-top: 33px;
    }
    &__header {
      font-size: 24px;
      margin: 45px 0 16px 0;
      font-weight: bold;
      &--filler {
        background-color: @cd-very-light-grey;
        height: 24px;
        width: 176px;
      }
    }
    &__info {
      margin-bottom: 16px;
    }
    &__label {
      margin-bottom: 5px;
      display: inline-block;
      font-size: 14px;
      font-weight: 700;
    }
    &__email {
      padding: 8px 0px 24px;
    }
    &__names {
      padding: 8px 0px 24px;

      &-label {
        flex-basis: 100%;
      }
      &-first, &-last {
        display: inline;
      }
      &--error {
        margin-top: -30px;
      }
    }
    &__errors {
      padding: 6px 0px;
    }
    &__password-hint{
      font-size: 14px;
      color: #808890;
      margin-top: 4px;
      font-weight: 300;
    }
    &__dob-picker-wrapper {
      max-width: 50%;
      padding: 8px 0px 24px;
    }
    &__password {
      padding: 8px 0px 24px;
      &-visibility {
        padding-left: 6px;
      }
    }
    &__recaptcha {
        padding: 8px 0px 24px;
    }
    &__agreement {
        padding: 8px 0px 24px;
    }
    &__terms-conditions {
      &-error {
        display: block;
      }
    }
    &__submit {
      .primary-button-large;
      margin-top: 24px;
      margin-bottom: 32px;
    }
    input[type=checkbox] {
      width: 21px;
      height: 21px;
      position: relative;
      margin-right:10px;
      &:focus {
        outline: 0;
      }
      &:after {
        border-radius: 15%;
        content: '';
        display: block;
        position: absolute;
        top: 0; right: 0;
        bottom: 0; left: 0;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;

      }
      &:hover:after, &:focus:after {
        border-color: #000;
      }
      &:checked::after {
        font-family: FontAwesome;
        content: "\f00c";
        text-align: center;
        border-color: #000;
      }
    }
    &__agreement {
      display: flex;
      &-left {
        flex:0;
      }
      &-right {
        padding-top: 3px;
        flex:12;
      }
    }
  }
  .form() {
    display: inline-block;
    font-family: Lato, Arial, Helvetica, sans-serif;
    font-size: 14px;
    text-align: left;
    font-weight: 300;
    color: black;
  }

  .form-control[type=text], .form-control[type=email] {
    .form;
    width: 230px;
    height: 36px;
  }
  .form-control[name="firstName"], .form-control[name="lastName"]{
    .form;
    width: 170px;
  }
  .form-control[type=radio] {
    box-shadow: none;
  }
  .form-control[type=password] {
    .form;
    width: 230px;
    height: 36px;
  }

  @media (max-width: @screen-xs-max) {
    .cd-create-account {
      &__dob-picker-wrapper {
        max-width: 100%;
      }
    }
  }
</style>
<style lang="less">
  .cd-create-account__dob-picker-wrapper-select {
    font-weight: 400;
  }
</style>
