<template>
  <form class="cd-create-account" @submit.prevent="register">
    <h3>{{ $t('Register your details so you can book Dojo Events') }}</h3>
    <div>
      <div>
        <p>
          <i class="fa fa-info-circle"></i>
          {{ $t('If you are a parent or a guardian booking tickets for a child, please still tell us your details here.')  }} <br/>
          {{ $t('We collect this to help Dojos to contact them who\'s coming.') }}
        </p>
      </div>
      <div>
        <label class="cd-create-account__label" for="email">{{ $t('Your email') }}</label>
        <input type="email" :placeholder="$t('Email address')" class="form-control" name="email" id="email" data-vv-as="email" v-validate="'required|email'" v-model="profile.email">
        <p class="cd-create-account-form__email-error text-danger" v-show="errors.has('email:required')">{{ $t('Parent email address is required') }}</p>
        <p class="cd-create-account-form__email-error text-danger" v-show="errors.has('email:email')">{{ $t('Parent email address is invalid') }}</p>
      </div>
      <div class="cd-create-account__names" >
        <label class="cd-create-account__label cd-create-account__names-label" for="firstName">{{ $t('Name') }}</label>
        <div class="cd-create-account__names-first" :class="{'cd-create-account__names--error': errors.has('lastName:required') && !errors.has('firstName:required')}">
          <input type="text" class="form-control" name="firstName" :placeholder="$t('First Name')" id="name" data-vv-as="first name" v-validate="'required'" v-model="profile.firstName">
          <p class="cd-create-account-form__first-name-error text-danger" v-show="errors.has('firstName:required')" for="firstName">{{ $t('First name is required') }}</p>
        </div>
          <div class="cd-create-account__names-last" :class="{'cd-create-account__names--error': !errors.has('lastName:required') && errors.has('firstName:required')}">
          <input type="text" class="form-control" name="lastName" :placeholder="$t('Last Name')" id="lastName" data-vv-as="last name" v-validate="'required'" v-model="profile.lastName">
          <p class="cd-create-account-form__last-name-error text-danger" v-show="errors.has('lastName:required')" for="lastName">{{ $t('Last name is required') }}</p>
        </div>
      </div>
      <div class="cd-create-account__dob">
        <label class="cd-create-account__label" for="dob">{{ $t('Enter your Date of Birth') }}</label>
        <div class="cd-create-account__dob-picker-wrapper">
          <vue-dob-picker v-model="dob" select-class="form-control" id="dob" class="cd-create-account__dob-picker"
            v-validate="'required'"
            data-vv-name="dob"
            data-vv-value-path="value"
            data-vv-as="date of birth"
            show-labels="false" month-format="short"
            :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
            :proportions="[2, 2, 3]"></vue-dob-picker>
        </div>
        <p v-if="isUnderage" class="cd-create-account__dob-error text-danger">
          {{ $t('Sorry :( Children under 13 are note allowed to book events.') }} 
          {{ $t('You can ask your parent or guardian to bookfor you.') }}
        </p>
        <p class="cd-create-account__dob-error text-danger"
          v-show="errors.has('dob:required')">{{ $t('Date of birth is required') }}</p>
      </div>
      <div>
        <label class="cd-create-account__label" for="password">{{ $t('Password') }}</label>
        <p class="cd-create-account__password-hint">
          {{ $t('Password must be at least 8 characters with at least one numeric.') }}
        </p>
        <input :type="isPasswordVisible? 'text': 'password'" class="form-control" placeholder="Password" name="password" id="password" data-vv-as="password"
               v-validate="'required|cd-password'" v-model="password"/>
        <i class="fa cd-create-account__password-visibility" :class="isPasswordVisible ? 'fa-eye-slash': 'fa-eye' " @click="togglePasswordVisibility()"></i>
        <p class="text-danger cd-create-account__password-error"
               v-show="errors.has('password')">{{ $t(errors.first('password')) }}</p>
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
            <span>{{ $t('I want to join the CoderDojo Mailing List') }}</span>
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
            <span v-html="$t('I agree with {openLinkTag}Terms & Conditions{closingLinkTag}', { openLinkTag: '<a class=\'cd-create-account__terms-conditions-link\' href=\'https://zen.coderdojo.com/terms-and-conditions\'>', closingLinkTag: '</a>' })"></span>
          </span>
        </div>
        <p class="text-danger cd-create-account__terms-conditions-error"
               v-show="errors.has('termsConditionsAccepted')">
            {{ $t('You must accept the terms and conditions before proceeding.') }}
        </p>
        <button type="submit" name="registration" class="cd-create-account__submit" v-validate="'nick-exists'" >{{ $t('Next') }}</button>
        <p class="cd-create-account__errors text-danger" v-show="errors.has('registration')">{{ $t('An user already exists for this email.') }} {{ $t('Login to your account to continue.') }}</p>
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

  export default {
    name: 'BookingCreateAccount',
    props: ['context'],
    components: {
      VueRecaptcha,
      VueDobPicker,
    },
    data() {
      return {
        profile: {
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
      };
    },
    computed: {
      user() {
        return extend({}, this.profile, {
          password: this.password,
          'g-recaptcha-response': this.recaptchaResponse,
          initUserType: {
            title: 'Parent/Guardian',
            name: 'parent-guardian',
          },
          termsConditionsAccepted: this.termsConditionsAccepted,
          mailingList: this.isSubscribedToMailingList,
        });
      },
      isUnderage() {
        return UserUtils.isUnderAge(this.dob);
      },
    },
    methods: {
      async validateForm() {
        try {
          if (this.isUnderage) {
            return false;
          }
          const res = await this.$validator.validateAll() && !!this.recaptchaResponse;
          if (!this.recaptchaResponse) {
            alert('Please complete the reCAPTCHA');
            return false;
          }
          return res;
        } catch (e) {
          return false;
        }
      },
      async register() {
        const ready = await this.validateForm();
        if (ready) {
          const isAdult = UserUtils.getAge(new Date(this.dob)) > 18;
          const context = this.context;
          this.$ga.event(this.$route.name, 'click', `register_${isAdult ? 'adult' : 'kid'}`);
          try {
            await UserService.register(
              this.user,
              UserUtils.profileToJSON(
                extend(
                  {},
                  this.profile,
                  { dob: this.dob, ...context },
            )));
            this.$emit('registered');
          } catch (err) {
            if (err.message === 'nick-exists') {
              this.$validator.errorBag.add('registration', 'Nick exists', 'nick-exists');
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
  @import '../common/styles/cd-primary-button'; 
  .cd-create-account {
    margin-right: 33px;
    margin-top: 50px;
    &__recaptcha{
      margin-top: 33px;
    }
    &__header {
      background-color: #f4f5f6;
      height: 100px;
      text-align: center;
      &-title {
        margin-top: 21px;
        font-size: 18px;
        font-weight: bold;
      }
      &-info {
        font-size: 16px;
        margin-top: 4px;
      }
    }
    &__label {
      margin-top: 16px;
      display: block;
      font-size: 16px;
      font-weight: bold;
    }
    &__names {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      &-label {
        flex-basis: 100%;
      }
      &-first {
        margin-right: 8px;
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
    &__dob-picker {
      padding-left: 0;
      max-width: 600px;
    }
    &__password {
      &-visibility {
        padding-left: 6px;
      }
    }
    &__terms-conditions {
      &-error {
        display: block;
      }
    }
    &__submit {
      .active-primary-button;
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
</style>
