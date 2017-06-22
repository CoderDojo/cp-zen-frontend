<template>
  <div class="cd-booking-create-account">
    <label for="password">Password</label>
    <input type="password" name="password" id="password" data-vv-as="password" v-validate.initial="'required|confirmed:confirmPassword|cd-password'" v-model="password" />
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
  </div>
</template>
<script>
  import { extend, clone, cloneDeep } from 'lodash';
  import VueRecaptcha from 'vue-recaptcha';
  import UserService from '@/users/service';
  import EventsService from '@/events/service';
  import DojoService from '@/dojos/service';
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
      isValid() {
        this.formValidated = true;
        return (!this.errors.any() && !!this.recaptchaResponse);
      },
      submitAccount() {
        return this.register()
          .then(this.addChildren)
          .then(this.joinDojo)
          .then(this.bookTickets);
      },
      register() {
        const bookingData = StoreService.load(`booking-${this.eventId}`);
        this.parent = bookingData.parent;
        return UserService.register(this.user, this.parent);
      },
      addChildren() {
        const bookingData = StoreService.load(`booking-${this.eventId}`);
        let promiseChain = Promise.resolve();
        bookingData.children.forEach((child) => {
          const childClone = cloneDeep(child);
          childClone.dob = new Date(child.dob.year, child.dob.month - 1, child.dob.date, 0, 0, 0, 0);
          promiseChain = promiseChain.then(() => UserService.addChild(childClone));
        });
        return promiseChain;
      },
      joinDojo() {
        return UserService.getCurrentUser().then((response) => {
          const user = response.body.user;
          const selectedEvent = StoreService.load('selected-event');
          return DojoService.joinDojo(user.id, selectedEvent.dojoId, [this.user.initUserType.name]);
        });
      },
      bookTickets() {
        return UserService.getCurrentUser().then((response) => {
          const user = response.body.user;
          const selectedEvent = StoreService.load('selected-event');
          const bookingSessions = StoreService.load('booking-sessions');
          return EventsService.bookTickets(user, selectedEvent, bookingSessions);
        });
      },
      getRecaptchaResponse() {
        return this.recaptchaResponse;
      },
      onRecaptchaVerify(response) {
        this.recaptchaResponse = response;
      },
    },
  };
</script>
