<template>
  <div class="cd-create-account">
    <!--<div class="cd-create-account__header">
      <div class="cd-create-account__header-title">
        {{ $t('Create a CoderDojo Account') }}
      </div>
      <div class="cd-create-account__header-info">
        {{ $t('Keep track of your Dojos and book event tickets faster') }}
      </div>
    </div>-->
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
      <div>
        <label class="cd-create-account__label" for="name">{{ $t('Name') }}</label>
        <input type="text" class="form-control" name="firstName" :placeholder="$t('First Name')" id="name" data-vv-as="first name" v-validate="'required'" v-model="profile.firstName">

        <input type="text" class="form-control" name="lastName" :placeholder="$t('Last Name')" id="lastName" data-vv-as="last name" v-validate="'required'" v-model="profile.lastName">
        <p class="cd-create-account-form__first-name-error text-danger" v-show="errors.has('firstName:required')">{{ $t('First name is required') }}</p>
        <p class="cd-create-account-form__last-name-error text-danger" v-show="errors.has('lastName:required')">{{ $t('Last name is required') }}</p>
      </div>
      <div>
        <h2 v-if="isDobUnderage" class="cd-create-account-dob__dob-error">{{ $t('You will need your parent to carry out the registration.') }}</h2>
        <label class="cd-create-account__label" for="dob">{{ $t('Enter your Date of Birth') }}</label>
        <div class="cd-create-account__dob-picker-wrapper">
          <vue-dob-picker v-model="date" select-class="form-control" id="dob" class="cd-create-account__dob"
            show-labels="false" month-format="short"
            :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
            :proportions="[2, 2, 3]"></vue-dob-picker>
        </div>
      </div>
      <div>
        <label class="cd-create-account__label" for="password">{{ $t('Password') }}</label>
        <input type="password" class="form-control" placeholder="Password" name="password" id="password" data-vv-as="password"
               v-validate="'required|cd-password'" v-model="profile.password"/>
        <i class="fa cd-create-account__password-visibility" :class="isPasswordVisible ? 'fa-eye-slash': 'fa-eye' " @click="togglePasswordVisibility()"></i>
        <label class="text-danger cd-create-account__password-error"
               v-show="errors.has('password')">{{ $t(errors.first('password')) }}</label>
      </div>
      <div class="cd-create-account__password-hint">
        {{ $t('Password must be at least 8 characters with at least one numeric.') }}
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
                      v-model="profile.termsConditionsAccepted"/>
          </span>
          <span class="cd-create-account__agreement-right">
            <span v-html="$t('I agree with {openLinkTag}Terms & Conditions{closingLinkTag}', { openLinkTag: '<a class=\'cd-create-account__terms-conditions-link\' href=\'https://zen.coderdojo.com/terms-and-conditions\'>', closingLinkTag: '</a>' })"></span>
          </span>
        </div>
        <label class="text-danger cd-create-account__terms-conditions-error"
               v-show="errors.has('termsConditionsAccepted')">
            {{ $t('You must accept the terms and conditions before proceeding.') }}
        </label>
        <button type="submit" class="cd-create-account__submit" >{{ $t('Next') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { extend, omit } from 'lodash';
  import VueRecaptcha from 'vue-recaptcha';
  import VueDobPicker from 'vue-dob-picker';
  import UserService from '@/users/service';
  import UserUtils from '@/users/util';
  import StoreService from '@/store/store-service';

  function forEachTicket(bookingData, cb) {
    Object.keys(bookingData).forEach((ticketId) => {
      bookingData[ticketId].selectedTickets.forEach(cb);
    });
  }

  export default {
    name: 'BookingCreateAccount',
    props: ['eventId'],
    components: {
      VueRecaptcha,
      VueDobPicker,
    },
    data() {
      return {
        profile: {},
        confirmPassword: null,
        isSubscribedToMailingList: false,
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
        recaptchaResponse: null,
        isPasswordVisible: false,
      };
    },
    computed: {
      user() {
        return extend(omit(this.profile, ['dob']), {
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
    },
    methods: {
      async validateForm() {
        try {
          return await this.$validator.validateAll() && !!this.recaptchaResponse;
        } catch (e) {
          return false;
        }
      },
      async register() {
        this.profile = StoreService.load(`booking-${this.eventId}-user`);
        const isAdult = UserUtils.getAge(new Date(this.profile.dob)) > 18;
        this.$ga.event(this.$route.name, 'click', `register_${isAdult ? 'adult' : 'kid'}`);
        return UserService.register(this.user, UserUtils.profileToJSON(this.profile));
      },
      getRecaptchaResponse() {
        return this.recaptchaResponse;
      },
      onRecaptchaVerify(response) {
        this.recaptchaResponse = response;
      },
      togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        const field = document.querySelector('input[name="password"]');
        field.type = this.isPasswordVisible ? 'text' : 'password';
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
    &__password-hint{
      font-size: 14px;
      color: #808890;
      margin-top: 4px;
      font-weight: 300;
    }
    &__dob {
      padding-left: 0;
      max-width: 600px;
    }
    &__password {
      &-visibility {
        padding-left: 6px;
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

  .form-control[type=text], .form-control[type=email] {
    width: 230px;
    display: inline-block;
    font-family: Lato, Arial, Helvetica, sans-serif;
    font-size: 14px;
    text-align: left;
    font-weight: 300;
    height: 36px;
    color: black;
  }
  .form-control[name="firstName"], .form-control[name="lastName"]{
    width: 170px;
    display: inline-block;
    font-family: Lato, Arial, Helvetica, sans-serif;
    font-size: 14px;
    text-align: left;
    font-weight: 300;
  }
  .form-control[type=radio] {
    box-shadow: none;
  }
  .form-control[type=password] {
    width: 230px;
    display: inline-block;
    font-weight: 300;
    height: 36px;
    color: black;
  }
</style>
