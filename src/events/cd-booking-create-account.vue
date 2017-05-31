<template>
  <div class="cd-booking-create-account">
    <form @submit.prevent="onSubmit">
      <label for="password">Password</label>
      <input type="password" name="password" id="password" v-model="password" />
      <label for="password">Confirm Password</label>
      <input type="password" name="confirmPassword" id="confirmPassword" v-model="confirmPassword" />
      <label><input type="checkbox" name="termsConditionsAccepted" v-model="termsConditionsAccepted" /> I accept the T&Cs</label>
      <div class="cd-booking-create-account__recaptcha">
        <vue-recaptcha :sitekey="recaptchaSiteKey" @verify="onRecaptchaVerify"></vue-recaptcha>
      </div>
      <input type="submit" value="Create Account" />
    </form>
  </div>
</template>
<script>
  import { extend } from 'lodash';
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
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
        recaptchaResponse: null,
      };
    },
    computed: {
      user() {
        return extend(this.parent, {
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
      onSubmit() {
        if (this.password && this.recaptchaResponse &&
          this.password === this.confirmPassword && this.termsConditionsAccepted) {
          this.register();
        } else if (this.password !== this.confirmPassword) {
          // eslint-disable-next-line
          alert('Passwords do not match');
        } else if (!this.recaptchaResponse) {
          // eslint-disable-next-line
          alert('Please complete reCAPTCHA');
        } else if (!this.termsConditionsAccepted) {
          // eslint-disable-next-line
          alert('Please read and accept T&Cs');
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
