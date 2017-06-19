<template>
  <div class="cd-booking-parent-form">
    <label for="firstName">First name</label>
    <input type="text" name="firstName" id="firstName" data-vv-as="first name" v-validate.initial="'required'" v-model="firstName"><br/>
    <p id="firstNameValidationError" class="text-danger" v-show="formValidated && errors.has('firstName')">{{ errors.first('firstName') }}</p>

    <label for="lastName">Last name</label>
    <input type="text" name="lastName" id="lastName" data-vv-as="last name" v-validate.initial="'required'" v-model="lastName"><br/>
    <p id="lastNameValidationError" class="text-danger" v-show="formValidated && errors.has('lastName')">{{ errors.first('lastName') }}</p>

    <label for="phoneNumber">Phone number</label>
    <input type="text" name="phoneNumber" id="phoneNumber" data-vv-as="phone number" v-validate.initial="'required|numeric'" v-model="phone"><br/>
    <p id="phoneNumberValidationError" class="text-danger" v-show="formValidated && errors.has('phoneNumber')">{{ errors.first('phoneNumber') }}</p>

    <label for="email">Email address</label>
    <input type="text" name="email" id="email" data-vv-as="email" v-validate.initial="'required|email'" v-model="email"><br/>
    <p id="emailValidationError" class="text-danger" v-show="formValidated && errors.has('email')">{{ errors.first('email') }}</p>

    <div v-for="(ticket, index) in ninjaTickets">
      <h4 class="cd-booking-parent-form__child-section">{{ ticket.name }} ({{ ticket.sessionName }})</h4>
      <label>
        Name
        <input type="text" placeholder="First Name" v-model="childrenFormData[index].firstName" class="cd-booking-parent-form__child-first-name" />
        <input type="text" placeholder="Last Name" v-model="childrenFormData[index].lastName" class="cd-booking-parent-form__child-last-name" />
      </label>
      <label>
        Date of birth
        <input type="text" placeholder="Date" v-model="childrenFormData[index].dob.date" class="cd-booking-parent-form__child-dob-date" />
        <input type="text" placeholder="Month" v-model="childrenFormData[index].dob.month" class="cd-booking-parent-form__child-dob-month" />
        <input type="text" placeholder="Year" v-model="childrenFormData[index].dob.year" class="cd-booking-parent-form__child-dob-year" />
      </label>
      <label>
        Email address (optional)
        <input type="email" placeholder="Email address" v-model="childrenFormData[index].email" class="cd-booking-parent-form__child-email" />
      </label>
      <label>Gender</label>
      <div class="cd-booking-parent-form__child-gender">
        <label><input type="radio" :name="'childGender' + index" value="Male" v-model="childrenFormData[index].gender" /> Male</label>
        <label><input type="radio" :name="'childGender' + index" value="Female" v-model="childrenFormData[index].gender" /> Female</label>
        <label><input type="radio" :name="'childGender' + index" value="Other" v-model="childrenFormData[index].gender" /> Not Listed:</label><input type="text" :name="'otherGender' + index" v-model="childrenFormData[index].otherGender" />
        <label><input type="radio" :name="'childGender' + index" value="Undisclosed" v-model="childrenFormData[index].gender" /> Prefer not to answer</label>
      </div>
    </div>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import { pick } from 'lodash';

  export default {
    name: 'bookingParentForm',
    props: ['eventId', 'tickets'],
    data() {
      return {
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        formValidated: false,
        childrenFormData: [],
      };
    },
    methods: {
      isValid() {
        this.formValidated = true;
        return !this.errors.any();
      },
      submitBooking() {
        StoreService.save(`booking-${this.eventId}`, { parent: pick(this, ['firstName', 'lastName', 'phone', 'email']), children: this.childrenFormData });
      },
    },
    created() {
      this.ninjaTickets.forEach(() => this.childrenFormData.push({ dob: {} }));
    },
    computed: {
      ninjaTickets() {
        const ninjaTickets = [];
        this.tickets.forEach((ticket) => {
          if (ticket.type === 'ninja') {
            for (let i = 0; i < ticket.quantity; i += 1) {
              ninjaTickets.push(ticket);
            }
          }
        });
        return ninjaTickets;
      },
    },
  };
</script>
<style scoped></style>
