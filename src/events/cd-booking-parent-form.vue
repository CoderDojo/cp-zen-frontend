<template>
  <div class="cd-booking-parent-form">
    <form @submit.prevent="doValidate">
      <label for="firstName">First name</label>
      <input type="text" name="firstName" id="firstName" v-validate="firstName" data-vv-rules="required" v-model="firstName"><br/>
      <p id="firstNameValidationError" class="text-danger" v-show="formValidated && errors.has('firstName')">{{ errors.first('firstName') }}</p>

      <label for="lastName">Last name</label>
      <input type="text" name="lastName" id="lastName" v-validate="lastName" data-vv-rules="required"  v-model="lastName"><br/>
      <p id="lastNameValidationError" class="text-danger" v-show="formValidated && errors.has('lastName')">{{ errors.first('lastName') }}</p>

      <label for="phoneNumber">Phone number</label>
      <input type="text" name="phoneNumber" id="phoneNumber" v-validate="phoneNumber" data-vv-rules="required|numeric"  v-model="phoneNumber"><br/>
      <p id="phoneNumberValidationError" class="text-danger" v-show="formValidated && errors.has('phoneNumber')">{{ errors.first('phoneNumber') }}</p>

      <label for="email">Email address</label>
      <input type="text" name="email" v-validate="email" id="email" data-vv-rules="required|email" v-model="email"><br/>
      <p id="emailValidationError" class="text-danger" v-show="formValidated && errors.has('email')">{{ errors.first('email') }}</p>

      <input type="submit" value="Submit Booking"/>
    </form>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import { pick } from 'lodash';

  export default {
    name: 'bookingParentForm',
    props: ['eventId'],
    data() {
      return {
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        formValidated: false,
      };
    },
    methods: {
      submitBooking() {
        StoreService.save(`booking-${this.eventId}`, { parent: pick(this, ['firstName', 'lastName', 'phoneNumber', 'email']) });
        this.$router.push(`/events/${this.eventId}/create-account`);
      },
      doValidate() {
        this.formValidated = true;
        if (!this.errors.any()) {
          this.submitBooking();
        }
      },
    },
  };
</script>
<style scoped></style>
