<template>
  <div class="cd-booking-create-account">
    <div class="cd-booking-create-account__header row">
      <div class="cd-booking-create-account__header-title">
        {{ $t('Create a CoderDojo Account') }}
      </div>
      <div class="cd-booking-create-account__header-info">
        {{ $t('Keep track of your Dojos and book event tickets faster') }}
      </div>
    </div>
    <div class="cd-booking-create-account__container">
    <div class="row">
      <label class="cd-booking-create-account__label" for="password">{{ $t('Password') }}</label>
      <input type="password" class="form-control" placeholder="Password" name="password" id="password" data-vv-as="password"
             v-validate.initial="'required|confirmed:confirmPassword|cd-password'" v-model="password"/>
      <label class="text-danger cd-booking-create-account__password-error"
             v-show="formValidated && errors.has('password')">{{ $t(errors.first('password')) }}</label>
    </div>
    <div class="row cd-booking-create-account__password-hint">
      {{ $t('Password must be at least 8 characters with at least one numeric.') }}
    </div>
    <div class="row">
      <label class="cd-booking-create-account__label" for="password">{{ $t('Confirm Password') }}</label>
      <input type="password" class="form-control" placeholder="Password" name="confirmPassword" id="confirmPassword" data-vv-as="password confirmation"
             v-validate.initial="'required'" v-model="confirmPassword"/>
      <label class="text-danger cd-booking-create-account__password-confirmation-error"
             v-show="formValidated && errors.has('confirmPassword')">{{ $t(errors.first('confirmPassword')) }}</label>
    </div>
    <div class="row">
      <div class="cd-booking-create-account__recaptcha">
        <vue-recaptcha :sitekey="recaptchaSiteKey" @verify="onRecaptchaVerify"></vue-recaptcha>
      </div>
    </div>
    <div class="row">
      <label class="cd-booking-create-account__label"><input type="checkbox"  name="termsConditionsAccepted" v-validate.initial="'required'"
                    v-model="termsConditionsAccepted"/>
        <span v-html="$t('I agree with {openLinkTag}Terms & Conditions{closingLinkTag}', { openLinkTag: '<a class=\'cd-booking-create-account__terms-conditions-link\' href=\'https://zen.coderdojo.com/terms-and-conditions\'>', closingLinkTag: '</a>' })"></span>
      </label>
      <label class="text-danger cd-booking-create-account__terms-conditions-error"
             v-show="formValidated && errors.has('termsConditionsAccepted')">
        {{ $t('You must accept the terms and conditions before proceeding.') }}
      </label>
    </div>
    <div class="row">
      <label class="cd-booking-create-account__label">
        <input type="checkbox" name="dataConsentAccepted" id="consentData" v-validate.initial="'required'"
               v-model="dataConsentAccepted"/>
        <span v-html="$t('I consent to the use of my data ({openLinkTag}Data policy{closingLinkTag})', { openLinkTag: '<a class=\'cd-booking-create-account__data-usage-link\' href=\'http://www.icecreammakesuhappy.ie/\'>', closingLinkTag: '</a>' })"></span>
      </label>
      <label class="text-danger cd-booking-create-account__data-consent-error"
             v-show="formValidated && errors.has('dataConsentAccepted')">
        {{ $t('You must consent to the use of your data before proceeding.') }}
      </label>
    </div>
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
    },
    data() {
      return {
        profile: null,
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
        return extend(clone(this.profile), {
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
        this.profile = StoreService.load(`booking-${this.eventId}-user`);
        return UserService.register(this.user, this.profile);
      },
      addChildren() {
        const bookingData = StoreService.load(`booking-${this.eventId}-sessions`);
        let promiseChain = Promise.resolve();
        forEachTicket(bookingData, (ticket) => {
          if (ticket.ticket.type === 'ninja') {
            const child = cloneDeep(ticket.user);
            child.dob = new Date(child.dob.year, child.dob.month - 1, child.dob.date, 0, 0, 0, 0);
            promiseChain = promiseChain.then(() => UserService.addChild(child))
              .then((response) => {
                ticket.user = response.body; // eslint-disable-line no-param-reassign
              });
          }
        });
        promiseChain = promiseChain.then(() => {
          StoreService.save(`booking-${this.eventId}-sessions`, bookingData);
          return Promise.resolve();
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
          const loggedInUser = response.body.user;
          const selectedEvent = StoreService.load('selected-event');
          const bookingSessions = StoreService.load(`booking-${this.eventId}-sessions`);
          const applications = [];
          forEachTicket(bookingSessions, (ticket) => {
            applications.push({
              dojoId: selectedEvent.dojoId,
              eventId: selectedEvent.id,
              sessionId: ticket.ticket.sessionId,
              ticketName: ticket.ticket.name,
              ticketType: ticket.ticket.type,
              ticketId: ticket.ticket.id,
              userId: (ticket.user && ticket.user.userId) || loggedInUser.id,
              notes: 'N/A',
            });
          });
          return EventsService.bookTickets(applications);
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
<style scoped lang="less">
  .cd-booking-create-account {
    margin-right: 33px;
    margin-top: 50px;
    padding: 0 16px 16px 16px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
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
    &__container{
      margin-left: 25px;
    }
    &__label {
      margin-top: 32px;
      display: block;
      font-size: 16px;
      font-weight: normal;
    }
    &__password-hint{
      font-size: 14px;
      color: #808890;
      margin-top: 4px;
      font-weight: 300;
    }
  }
  .form-control[type=password] {
    width: 230px;
    display: inline-block;
    font-weight: 300;
  }
  .form-control[type=checkbox] {
    box-shadow: none;

  }
</style>
