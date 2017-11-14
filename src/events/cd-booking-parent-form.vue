<template>
  <div class="cd-booking-parent-form">
    <div class="cd-booking-parent-form__attendee-type-header">
      {{ $t('Parent / Guardian') }}
    </div>
    <label class="cd-booking-parent-form__label" for="name">{{ $t('Name') }}</label>
    <input type="text" class="form-control" name="firstName" :placeholder="$t('First Name')" id="name" data-vv-as="first name" v-validate="'required'" v-model="parentUserData.firstName">

    <input type="text" class="form-control" name="lastName" :placeholder="$t('Last Name')" id="lastName" data-vv-as="last name" v-validate="'required'" v-model="parentUserData.lastName">
    <p class="cd-booking-parent-form__first-name-error text-danger" v-show="errors.has('firstName:required')">{{ $t('First name is required') }}</p>
    <p class="cd-booking-parent-form__last-name-error text-danger" v-show="errors.has('lastName:required')">{{ $t('Last name is required') }}</p>

    <label class="cd-booking-parent-form__label cd-booking-parent-form__parent-dob-label">{{ $t('Date of Birth') }}</label>
    <vue-dob-picker v-model="parentUserData.dob"
                    v-validate="'required'"
                    data-vv-name="parentDob"
                    data-vv-value-path="value"
                    data-vv-as="date of birth"
                    class="cd-booking-parent-form__parent-dob"
                    select-class="form-control"
                    select-placeholder-class="form-control cd-select-placeholder"
                    month-format="short"
                    show-labels="false"
                    :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
                    :proportions="[7, 9, 9]"></vue-dob-picker>
    <p class="cd-booking-parent-form__dob-error text-danger" v-show="errors.has('parentDob:required')">{{ $t('Date of birth is required') }}</p>

    <label class="cd-booking-parent-form__label" for="phoneNumber">{{ $t('Phone Number') }}</label>
    <input type="text" class="form-control" placeholder="e.g. 35312345678" name="phoneNumber" id="phoneNumber" data-vv-as="phone number" v-validate="'required|numeric'" v-model="parentUserData.phone"><br/>
    <p class="cd-booking-parent-form__phone-error text-danger" v-show="errors.has('phoneNumber:required')">{{ $t('Phone number is required') }}</p>
    <p class="cd-booking-parent-form__phone-error text-danger" v-show="errors.has('phoneNumber:numeric')">{{ $t('Phone number is invalid') }}</p>

    <div v-for="ticket in ninjaTickets">
      <div v-for="(selectedTicket, index) in ticket.selectedTickets">
        <div class="cd-booking-parent-form__attendee-type-header">{{ selectedTicket.ticket.name }} ({{ ticket.session.name }})</div>
        <label class="cd-booking-parent-form__label">
          {{ $t('Name') }}
        </label>
        <input :name="`firstName-${selectedTicket.ticket.id}-${index}`" type="text" :placeholder="$t('First Name')" v-model="selectedTicket.user.firstName" class="cd-booking-parent-form__child-first-name form-control" data-vv-as="first name" v-validate="'required'" />
        <input :name="`lastName-${selectedTicket.ticket.id}-${index}`" type="text" :placeholder="$t('Last Name')" v-model="selectedTicket.user.lastName" class="cd-booking-parent-form__child-last-name form-control" data-vv-as="last name" v-validate="'required'" />
        <p class="cd-booking-parent-form__child-first-name-error text-danger" v-show="errors.has(`firstName-${selectedTicket.ticket.id}-${index}:required`)">
          {{ $t('First name is required') }}
        </p>
        <p class="cd-booking-parent-form__child-last-name-error text-danger" v-show="errors.has(`lastName-${selectedTicket.ticket.id}-${index}:required`)">
          {{ $t('Last name is required') }}
        </p>

        <label class="cd-booking-parent-form__label">
          {{ $t('Date of Birth') }}
        </label>
        <div class="cd-booking-parent-form__child-dob-wrapper">
          <vue-dob-picker v-model="selectedTicket.user.dob"
                          v-validate="'required'"
                          :data-vv-name="`dob-${selectedTicket.ticket.id}-${index}`"
                          data-vv-value-path="value"
                          data-vv-as="date of birth"
                          class="cd-booking-parent-form__child-dob"
                          select-class="form-control"
                          select-placeholder-class="form-control cd-select-placeholder"
                          month-format="short"
                          show-labels="false"
                          :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
                          :proportions="[7, 9, 9]"></vue-dob-picker>
          <p class="cd-booking-parent-form__child-dob-error text-danger" v-show="errors.has(`dob-${selectedTicket.ticket.id}-${index}:required`)">{{ $t('Date of birth is required') }}</p>
        </div>
        <span v-if="isYouthOverThirteen">
          <label class="cd-booking-parent-form__label">
            {{ $t('Email Address (optional)') }}
          </label>
          <input type="email" :placeholder="$t('Email address')" v-model="selectedTicket.user.email" class="cd-booking-parent-form__child-email form-control" />
        </span>
        <label class="cd-booking-parent-form__label">{{ $t('Gender') }}</label>
        <div class="cd-booking-parent-form__child-gender">
          <label class="cd-booking-parent-form__child-gender-option">
            <input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Male" v-model="selectedTicket.user.gender" data-vv-as="gender" v-validate="'required'" />
            <span> {{ $t('Male') }}</span>
          </label>
          <label class="cd-booking-parent-form__child-gender-option"><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Female" v-model="selectedTicket.user.gender" /><span> {{ $t('Female') }}</span></label>
          <label class="cd-booking-parent-form__child-gender-option">
            <input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Other" v-model="selectedTicket.user.gender" />
            <span> {{ $t('Not Listed. Specify here:') }}</span>
          </label>
          <div class="cd-booking-parent-form__other-gender">
            <input :name="`otherChildGender${selectedTicket.ticket.id}${index}`" type="text" class="form-control" :placeholder="$t('Preferred Gender')" v-model="selectedTicket.user.otherGender" data-vv-as="gender" v-validate="selectedTicket.user.gender === 'Other' ? 'required' : ''" />
            <p class="text-danger" v-show="errors.has(`otherChildGender${selectedTicket.ticket.id}${index}:required`)">
              {{ $t('Preferred gender is required') }}
            </p>
          </div>
          <label class="cd-booking-parent-form__child-gender-option"><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Undisclosed" v-model="selectedTicket.user.gender" /> <span>{{ $t('Prefer not to answer') }}</span></label>
        </div>
        <p class="text-danger" v-show="errors.has(`childGender${selectedTicket.ticket.id}${index}`)">
          {{ $t(errors.first(`childGender${selectedTicket.ticket.id}${index}`)) }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import VueDobPicker from 'vue-dob-picker';
  import StoreService from '@/store/store-service';
  import UsersUtil from '@/users/util';

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
        applicantDob: null,
      };
    },
    computed: {
      isYouthOverThirteen() {
        return UsersUtil.isYouthOverThirteen(this.applicantDob);
      },
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
      primaryYouth() {
        const firstTicket = this.bookedTickets[Object.keys(this.bookedTickets)[0]];
        if (this.isYouthOverThirteen && firstTicket.selectedTickets.length > 0) {
          return firstTicket.selectedTickets[0].user;
        }
        return null;
      },
    },
    methods: {
      async validateForm() {
        try {
          return await this.$validator.validateAll();
        } catch (e) {
          return false;
        }
      },
      submitBooking() {
        if (this.parentTicket && this.parentTicket.selectedTickets
          && this.parentTicket.selectedTickets.length > 0) {
          this.parentTicket.selectedTickets[0].user = this.parentUserData;
        }
        StoreService.save(`booking-${this.eventId}-user`, this.parentUserData);
        StoreService.save(`booking-${this.eventId}-sessions`, this.bookedTickets);
      },
      prefillDateOfBirth() {
        this.applicantDob = new Date(StoreService.load('applicant-dob'));
        if (this.primaryYouth) {
          this.primaryYouth.dob = this.applicantDob;
        } else {
          this.parentUserData.dob = this.applicantDob;
        }
      },
    },
    created() {
      this.bookedTickets = this.tickets;
      Object.keys(this.bookedTickets).forEach((ticketId) => {
        const ticketData = this.bookedTickets[ticketId];
        ticketData.selectedTickets.forEach((selectedTicket) => {
          selectedTicket.user = { dob: null }; // eslint-disable-line no-param-reassign
        });
      });
      this.prefillDateOfBirth();
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
    input[placeholder="First Name"] {
      margin-right: 6px;
    }
    &__child {
      &-gender-option {
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
      &-first-name {
        width: 170px !important;
        font-weight: 300;
      }
      &-last-name{
        width: 170px !important;
        font-weight: 300;
      }
      &-dob-wrapper {
        width: 266px;
      }
    }
    &__other-gender {
      margin-bottom: 20px;
      margin-left: 20px;
      margin-top: -7px;
    }
  }
  .form-control[type=text] {
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

</style>
