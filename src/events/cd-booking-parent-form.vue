<template>
  <div class="cd-booking-parent-form">
    <label for="firstName">First name</label>
    <input type="text" name="firstName" id="firstName" data-vv-as="first name" v-validate.initial="'required'" v-model="parentUserData.firstName"><br/>
    <p id="firstNameValidationError" class="text-danger" v-show="formValidated && errors.has('firstName')">{{ errors.first('firstName') }}</p>

    <label for="lastName">Last name</label>
    <input type="text" name="lastName" id="lastName" data-vv-as="last name" v-validate.initial="'required'" v-model="parentUserData.lastName"><br/>
    <p id="lastNameValidationError" class="text-danger" v-show="formValidated && errors.has('lastName')">{{ errors.first('lastName') }}</p>

    <label for="phoneNumber">Phone number</label>
    <input type="text" name="phoneNumber" id="phoneNumber" data-vv-as="phone number" v-validate.initial="'required|numeric'" v-model="parentUserData.phone"><br/>
    <p id="phoneNumberValidationError" class="text-danger" v-show="formValidated && errors.has('phoneNumber')">{{ errors.first('phoneNumber') }}</p>

    <label for="email">Email address</label>
    <input type="text" name="email" id="email" data-vv-as="email" v-validate.initial="'required|email'" v-model="parentUserData.email"><br/>
    <p id="emailValidationError" class="text-danger" v-show="formValidated && errors.has('email')">{{ errors.first('email') }}</p>

    <div v-for="ticket in ninjaTickets">
      <div v-for="(selectedTicket, index) in ticket.selectedTickets">
        <h4 class="cd-booking-parent-form__child-section">{{ selectedTicket.ticket.name }} ({{ ticket.session.name }})</h4>
        <label>
          Name
          <input type="text" placeholder="First Name" v-model="selectedTicket.user.firstName" class="cd-booking-parent-form__child-first-name" />
          <input type="text" placeholder="Last Name" v-model="selectedTicket.user.lastName" class="cd-booking-parent-form__child-last-name" />
        </label>
        <label>
          Date of birth
          <input type="text" placeholder="Date" v-model="selectedTicket.user.dob.date" class="cd-booking-parent-form__child-dob-date" />
          <input type="text" placeholder="Month" v-model="selectedTicket.user.dob.month" class="cd-booking-parent-form__child-dob-month" />
          <input type="text" placeholder="Year" v-model="selectedTicket.user.dob.year" class="cd-booking-parent-form__child-dob-year" />
        </label>
        <label>
          Email address (optional)
          <input type="email" placeholder="Email address" v-model="selectedTicket.user.email" class="cd-booking-parent-form__child-email" />
        </label>
        <label>Gender</label>
        <div class="cd-booking-parent-form__child-gender">
          <label><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Male" v-model="selectedTicket.user.gender" /> Male</label>
          <label><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Female" v-model="selectedTicket.user.gender" /> Female</label>
          <label><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Other" v-model="selectedTicket.user.gender" /> Not Listed:</label><input type="text" :name="'otherGender' + index" v-model="selectedTicket.user.otherGender" />
          <label><input type="radio" :name="'childGender' + selectedTicket.ticket.id + index" value="Undisclosed" v-model="selectedTicket.user.gender" /> Prefer not to answer</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
<style scoped></style>
