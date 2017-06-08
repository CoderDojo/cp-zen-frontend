<template>
  <div class="cd-booking-create-account">
    <form @submit.prevent="onValidate">
      <label for="password">Password</label>
      <input type="password" name="password" id="password" data-vv-as="password" v-validate.initial="'required|confirmed:confirmPassword'" v-model="password" />
      <label class="text-danger cd-booking-create-account__password-error" v-show="formValidated && errors.has('password')">{{ errors.first('password') }}</label>
      <label for="password">Confirm Password</label>
      <input type="password" name="confirmPassword" id="confirmPassword" data-vv-as="password confirmation" v-validate.initial="'required'" v-model="confirmPassword" />
      <label class="text-danger cd-booking-create-account__password-confirmation-error" v-show="formValidated && errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</label>
      <label><input type="checkbox" name="termsConditionsAccepted" v-validate.initial="'required'" v-model="termsConditionsAccepted" />
        I accept the T&Cs (<a class="cd-booking-create-account__terms-conditions-link" href="https://zen.coderdojo.com/terms-and-conditions">Terms & Conditions</a>)
      </label>
      <label class="text-danger cd-booking-create-account__terms-conditions-error" v-show="formValidated && errors.has('termsConditionsAccepted')">You must accept the terms and conditions before proceeding.</label>
      <label>
        <input type="checkbox" name="dataConsentAccepted" id="consentData" v-validate.initial="'required'" v-model="dataConsentAccepted" />
        I consent to the use of my data (<a class="cd-booking-create-account__data-usage-link" href="http://www.icecreammakesuhappy.ie/">Data policy</a>)
      </label>
      <label class="text-danger cd-booking-create-account__data-consent-error" v-show="formValidated && errors.has('dataConsentAccepted')">You must consent to the use of your data before proceeding.</label>
      <div class="cd-booking-create-account__recaptcha">
        <vue-recaptcha :sitekey="recaptchaSiteKey" @verify="onRecaptchaVerify"></vue-recaptcha>
      </div>
      <input type="submit" value="Create Account" />
    </form>
  </div>
</template>
<script>
  import { extend, clone } from 'lodash';
  import VueRecaptcha from 'vue-recaptcha';
  import UserService from '@/users/service';
  import StoreService from '@/store/store-service';

  export default {
    name: 'BookingCreateAccount',
    props: ['eventId'],
    components: {
      VueRecaptcha,
    },
    data() {
      return {
        parent: null,
        password: null,
        confirmPassword: null,
        termsConditionsAccepted: false,
        dataConsentAccepted: false,
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
        recaptchaResponse: null,
        formValidated: false,
      };
    },
    computed: {
      user() {
        return extend(clone(this.parent), {
          password: this.password,
          'g-recaptcha-response': this.recaptchaResponse,
          initUserType: {
            title: 'Parent/Guardian',
            name: 'parent-guardian',
          },
          termsConditionsAccepted: this.termsConditionsAccepted,
        });
      },
    },
    methods: {
      onValidate() {
        this.formValidated = true;
        if (!this.errors.any() && this.recaptchaResponse) {
          this.register();
        } else if (!this.recaptchaResponse) {
          // eslint-disable-next-line
          alert('Please complete reCAPTCHA');
        }
      },
      register() {
        this.parent = StoreService.load(`booking-${this.eventId}`).parent;
        UserService.register(this.user, this.parent)
          .then(() => {
            StoreService.save(`booking-${this.eventId}`, {
              parent: this.parent,
              accountCreated: true,
            });
            this.$router.push(`/events/${this.eventId}/confirmation`);
          });
      },
      onRecaptchaVerify(response) {
        this.recaptchaResponse = response;
      },
    },
  };
</script>
