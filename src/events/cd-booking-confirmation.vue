<template>
  <div class="cd-booking-confirmation">
    <p class="cd-booking-confirmation__account-creation-confirmation">Account created</p>
    <p class="cd-booking-confirmation__booking-confirmation">Your booking is completed successfully</p>
    <ul v-if="parent.firstName">
      <li class="cd-booking-confirmation__first-name">{{ parent.firstName }}</li>
      <li class="cd-booking-confirmation__last-name">{{ parent.lastName }}</li>
      <li class="cd-booking-confirmation__phone-number">{{ parent.phone }}</li>
      <li class="cd-booking-confirmation__email">{{ parent.email }}</li>
    </ul>
    <ul v-for="child in children">
      <li class="cd-booking-confirmation__child-first-name">{{ child.firstName }}</li>
      <li class="cd-booking-confirmation__child-last-name">{{ child.lastName }}</li>
      <li class="cd-booking-confirmation__child-dob-date">{{ child.dob.date }}</li>
      <li class="cd-booking-confirmation__child-dob-month">{{ child.dob.month }}</li>
      <li class="cd-booking-confirmation__child-dob-year">{{ child.dob.year }}</li>
      <li class="cd-booking-confirmation__child-email">{{ child.email }}</li>
      <li class="cd-booking-confirmation__child-gender">
        {{ child.gender }} <span v-if="child.otherGender">({{ child.otherGender }})</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';

  export default {
    name: 'bookingConfirmation',
    props: ['eventId'],
    data() {
      return {
        parent: {},
        children: null,
        accountCreated: false,
      };
    },
    methods: {
      loadBookingData() {
        const bookingData = StoreService.load(`booking-${this.eventId}`);
        this.parent = bookingData.parent;
        this.children = bookingData.children;
        this.accountCreated = bookingData.accountCreated;
      },
    },
    created() {
      this.loadBookingData();
    },
  };
</script>
<style scoped></style>
