<template>
  <div class="cd-event-dob-verification">
    <form @submit.prevent="next">
      <h2 v-if="isDobUnderage" class="cd-event-dob-verification__dob-error">{{ $t('You will need your parent to carry out the registration.') }}</h2>
      <label class="cd-event-dob-verification__verify-age-message">{{ $t('Please verify your age') }}</label>
      <label class="cd-event-dob-verification__dob-input-label" for="dob">{{ $t('Enter your Date of Birth') }}</label>
      <div class="cd-event-dob-verification__dob-picker-wrapper">
        <vue-dob-picker v-model="date" select-class="form-control" id="dob" class="cd-event-dob-verification__dob"
                        show-labels="false" month-format="short"
                        :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
                        :proportions="[2, 2, 3]"></vue-dob-picker>
      </div>
      <button @click="$router.back()" class="cd-event-dob-verification__cancel btn btn-primary">{{ $t('Cancel') }}</button>
      <input type="submit" class="cd-event-dob-verification__verify btn btn-primary" :value="$t('Verify')">
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
    name: 'EventDobVerification',
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
        this.isDobUnderage = UsersUtil.isUnderAge(this.date);
        if (this.isDobUnderage) {
          return;
        }
        StoreService.save('selected-event', this.eventDetails);
        StoreService.save('applicant-dob', this.date);
        this.$router.push({ name: 'EventSessions', params: { eventId: this.eventId } });
      },
    },
    created() {
      this.loadEvent();
    },
  };
</script>
<style scoped lang="less">
  .cd-event-dob-verification {
    &__verify-age-message {
      display: block;
      margin-bottom: 30px;
      font-size: 24px;
      margin-top: 45px;
      font-weight: bold;
    }
    &__dob-input-label {
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: normal;
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
