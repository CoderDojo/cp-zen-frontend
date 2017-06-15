<template>
  <div class="cd-event-details">
    <form @submit.prevent="next">
      <h1 v-if="eventDetails.name" class="cd-event-details__name">{{ eventDetails.name }}</h1>
      <h2 v-if="isDobUnderage" class="cd-event-details__dob-error">You will need your parent to carry out the registration.</h2>
      <label class="cd-event-details__verify-age-message">To continue, we need to verify your age.</label>
      <label class="cd-event-details__dob-input-label" for="dob">Enter your Date of Birth</label>
      <div class="cd-event-details__dob-picker-wrapper">
        <vue-dob-picker v-model="date" select-class="form-control" id="dob" class="cd-event-details__dob"
                        show-labels="false" month-format="short"
                        :placeholders="['Date', 'Month', 'Year']"
                        :proportions="[2, 2, 3]"></vue-dob-picker>
      </div>
      <button @click="cancel" class="cd-event-details__cancel btn btn-primary">Cancel</button>
      <input type="submit" class="cd-event-details__verify btn btn-primary" value="Verify">
    </form>
  </div>
</template>
<script>
  import VueDobPicker from 'vue-dob-picker';
  import StoreService from '@/store/store-service';
  import UsersUtil from '@/users/util';
  import EventService from './service';
  import EventSessions from './cd-event-sessions';

  export default {
    name: 'EventDetails',
    props: ['eventId'],
    components: {
      EventSessions,
      VueDobPicker,
    },
    data() {
      return {
        eventDetails: {},
        isDobUnderage: false,
        date: null,
      };
    },
    methods: {
      loadEvent() {
        EventService.loadEvent(this.eventId)
          .then((response) => {
            this.eventDetails = response.body;
          });
      },
      next() {
        this.isDobUnderage = UsersUtil.isUnderAge(this.date.getDate(),
          this.date.getMonth() + 1, this.date.getFullYear());
        if (this.isDobUnderage) {
          return;
        }
        StoreService.save('selected-event', this.eventDetails);
        this.$router.push(`/events/${this.eventId}/sessions`);
      },
      cancel() {
        window.history.back();
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
<style scoped lang="less">
  .cd-event-details {
    &__verify-age-message {
      display: block;
      margin-bottom: 30px;
      font-size: 16px;
    }
    &__dob-input-label {
      font-size: 16px;
      margin-bottom: 9px;
    }
    &__verify {
      margin-top: 60px;
      width: 197px;
      height: 46px;
      font-size: 16px;
      font-weight: bold;
    }
    &__cancel {
      margin-top: 60px;
      margin-right: 18.9px;
      width: 100px;
      height: 46px;
      color: #337ab7;
      background-color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }
    &__dob-picker-wrapper {
      max-width: 35%;
    }
  }
</style>
