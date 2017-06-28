<template>
  <div class="cd-booking-parent-form">
    <div class="cd-booking-parent-form__attendee-type-header">
      {{ $t('Parent / Guardian') }}
    </div>
    <label class="cd-booking-parent-form__label" for="name">{{ $t('Name') }}</label>
    <input type="text" class="form-control" name="firstName" :placeholder="$t('First Name')" id="name" data-vv-as="first name" v-validate.initial="'required'" v-model="parentUserData.firstName">

    <input type="text" class="form-control" name="lastName" :placeholder="$t('Last Name')" id="lastName" data-vv-as="last name" v-validate.initial="'required'" v-model="parentUserData.lastName">
    <p id="firstNameValidationError" class="text-danger" v-show="formValidated && errors.has('firstName')">{{ $t(errors.first('firstName')) }}</p>
    <p id="lastNameValidationError" class="text-danger" v-show="formValidated && errors.has('lastName')">{{ $t(errors.first('lastName')) }}</p>

    <label class="cd-booking-parent-form__label cd-booking-parent-form__parent-dob-label">{{ $t('Date of Birth') }}</label>
    <vue-dob-picker class="cd-booking-parent-form__parent-dob" v-model="parentUserDataDoB" select-class="form-control" select-placeholder-class="form-control cd-select-placeholder" month-format="short" show-labels="false" :placeholders="[$t('Date'), $t('Month'), $t('Year')]" :proportions="[7, 9, 9]"></vue-dob-picker>

    <label class="cd-booking-parent-form__label" for="phoneNumber">{{ $t('Phone Number') }}</label>
    <input type="text" class="form-control" placeholder="Eg. 353 123 45678" name="phoneNumber" id="phoneNumber" data-vv-as="phone number" v-validate.initial="'required|numeric'" v-model="parentUserData.phone"><br/>
    <p id="phoneNumberValidationError" class="text-danger" v-show="formValidated && errors.has('phoneNumber')">{{ $t(errors.first('phoneNumber')) }}</p>

    <label class="cd-booking-parent-form__label" for="email">{{ $t('Email Address') }}</label>
    <input type="email" :placeholder="$t('Email address')" class="form-control" name="email" id="email" data-vv-as="email" v-validate.initial="'required|email'" v-model="parentUserData.email">
    <p id="emailValidationError" class="text-danger" v-show="formValidated && errors.has('email')">{{ $t(errors.first('email')) }}</p>

    <div v-for="ticket in ninjaTickets">
      <div v-for="(selectedTicket, index) in ticket.selectedTickets">
        <div class="cd-booking-parent-form__attendee-type-header">{{ selectedTicket.ticket.name }} ({{ ticket.session.name }})</div>
        <label class="cd-booking-parent-form__label">
          {{ $t('Name') }}
        </label>
        <input type="text" :placeholder="$t('First Name')" v-model="selectedTicket.user.firstName" class="cd-booking-parent-form__child-first-name form-control" />
        <input type="text" :placeholder="$t('Last Name')" v-model="selectedTicket.user.lastName" class="cd-booking-parent-form__child-last-name form-control" />
        <br/>
        <label class="cd-booking-parent-form__label">
          {{ $t('Date of Birth') }}
        </label>
        <input type="text" :placeholder="$t('Date')" v-model="selectedTicket.user.dob.date" class="cd-booking-parent-form__child-dob-date form-control" />
        <input type="text" :placeholder="$t('Month')" v-model="selectedTicket.user.dob.month" class="cd-booking-parent-form__child-dob-month form-control" />
        <input type="text" :placeholder="$t('Year')" v-model="selectedTicket.user.dob.year" class="cd-booking-parent-form__child-dob-year form-control" />
        <label class="cd-booking-parent-form__label">
          {{ $t('Email Address (optional)') }}
        </label>
        <input type="email" :placeholder="$t('Email address')" v-model="selectedTicket.user.email" class="cd-booking-parent-form__child-email form-control" />
        <label class="cd-booking-parent-form__label">{{ $t('Gender') }}</label>
        <div class="cd-booking-parent-form__child-gender">
          <label class="cd-booking-parent-form__child-gender-option"><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Male" v-model="selectedTicket.user.gender" /><span> {{ $t('Male') }}</span></label>
          <label class="cd-booking-parent-form__child-gender-option"><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Female" v-model="selectedTicket.user.gender" /><span> {{ $t('Female') }}</span></label>
          <label class="cd-booking-parent-form__child-gender-option">
            <input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Other" v-model="selectedTicket.user.gender" />
            <span> {{ $t('Not Listed. Specify here:') }}</span>
          </label>
          <input type="text" class="form-control cd-booking-parent-form__other" :placeholder="$t('Preferred Gender')" :name="'otherGender' + index"  v-model="selectedTicket.user.otherGender"  />
          <label class="cd-booking-parent-form__child-gender-option"><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Undisclosed" v-model="selectedTicket.user.gender" /> <span>{{ $t('Prefer not to answer') }}</span></label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import VueDobPicker from 'vue-dob-picker';
  import StoreService from '@/store/store-service';

  function getTicketsByType(tickets, type) {
    const matchedTickets = {};
    Object.keys(tickets).forEach((ticketId) => {
      const ticketData = tickets[ticketId];
      if (ticketData.selectedTickets[0].ticket.type === type) {
        matchedTickets[ticketId] = ticketData;
      }
    });
    return matchedTickets;
  }

  export default {
    name: 'bookingParentForm',
    props: ['eventId', 'tickets'],
    components: {
      VueDobPicker,
    },
    data() {
      return {
        bookedTickets: {},
        parentUserData: {},
        formValidated: false,
        childrenFormData: [],
      };
    },
    computed: {
      ninjaTickets() {
        return getTicketsByType(this.tickets, 'ninja');
      },
      parentTicket() {
        const matchedTickets = getTicketsByType(this.tickets, 'parent-guardian');
        const ticketIds = Object.keys(matchedTickets);
        if (ticketIds.length > 0) {
          return matchedTickets[ticketIds[0]];
        }
        return null;
      },
      parentUserDataDoB: {
        get() {
          const dob = new Date(this.parentUserData.dob);
          if (dob.toString() !== 'Invalid Date') {
            return moment(dob).add(dob.getTimezoneOffset(), 'm').toDate();
          }
          return null;
        },
        set(val) {
          if (val) {
            this.parentUserData.dob = moment(val).subtract(val.getTimezoneOffset(), 'm').toISOString();
          }
        },
      },
    },
    methods: {
      isValid() {
        this.formValidated = true;
        return !this.errors.any();
      },
      submitBooking() {
        if (this.parentTicket && this.parentTicket.selectedTickets
          && this.parentTicket.selectedTickets.length > 0) {
          this.parentTicket.selectedTickets[0].user = this.parentUserData;
        }
        StoreService.save(`booking-${this.eventId}-user`, this.parentUserData);
        StoreService.save(`booking-${this.eventId}-sessions`, this.bookedTickets);
      },
    },
    created() {
      this.bookedTickets = this.tickets;
      Object.keys(this.bookedTickets).forEach((ticketId) => {
        const ticketData = this.bookedTickets[ticketId];
        ticketData.selectedTickets.forEach((selectedTicket) => {
          selectedTicket.user = { dob: {} }; // eslint-disable-line no-param-reassign
        });
      });
    },
  };
</script>
<style scoped lang="less">

  .cd-booking-parent-form {
    &__attendee-type-header {
      font-size: 18px;
      font-weight: bold;
      margin-right: 33px;
      margin-top: 48px;
      padding-bottom: 9px;
      border-bottom: solid 1px #bdc3c6;
    }

    &__label {
      margin-top: 32px;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: normal;
      display: block;
    }

    input[type=radio] {
      width: 20px;
      height: 20px;
      position: relative;

      &:after {
       content: '';
       display: block;
       position: absolute;
       top: 0; right: 0;
       bottom: 0; left: 0;
       border: 1px solid #ccc;
       background: white;
       border-radius: 100%;
       cursor: pointer;
     }

     &:hover:after {
       border-color: #000;
     }

     &:checked::after {
       background: radial-gradient(ellipse at center, #000000 0%,#000000 45%,#ffffff 45%,#ffffff 100%);
       border-color: #000;
     }
    }

    &__parent-dob {
      width: 266px;
    }

    &__child-gender-option{
      display: flex;
      align-items: center;
      font-size: 14px;
      height: 17px;
      margin-bottom: 20px;
      font-weight: normal;
      span {
        padding-left: 8px;
      }
    }

    &__child-first-name{
       width: 170px !important;
       font-weight: 300;
    }

    &__child-last-name{
       width: 170px !important;
       font-weight: 300;
    }

    &__other {
      margin-bottom: 20px;
      margin-left: 20px;
      margin-top: -7px;
    }
  }

  .form-control[type=text], .form-control[type=email] {
    width: 230px;
    display: inline-block;
    font-family: Lato, Arial, Helvetica, sans-serif;
    font-size: 14px;
    text-align: left;
    font-weight: 300;
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

</style>
