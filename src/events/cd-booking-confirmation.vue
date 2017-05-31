<template>
  <div class="cd-booking-confirmation">
    <p class="cd-booking-confirmation__account-creation-confirmation" v-if="accountCreated">Account created</p>
    <ul v-if="parent.firstName">
      <li class="cd-booking-confirmation__first-name">{{ parent.firstName }}</li>
      <li class="cd-booking-confirmation__last-name">{{ parent.lastName }}</li>
      <li class="cd-booking-confirmation__phone-number">{{ parent.phoneNumber }}</li>
      <li class="cd-booking-confirmation__email">{{ parent.email }}</li>
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
        accountCreated: false,
      };
    },
    methods: {
      loadBookingData() {
        const bookingData = StoreService.load(`booking-${this.eventId}`);
        this.parent = bookingData.parent;
        this.accountCreated = bookingData.accountCreated;
      },
    },
    created() {
      this.loadBookingData();
    },
  };
</script>
<style scoped></style>
