<template>
  <div class="cd-booking-confirmation">
    <div class="cd-booking-confirmation__banner">
      <div class="cd-booking-confirmation__banner-left">
        <div class="cd-booking-confirmation__booking-confirmation">{{ $t('Booking Complete') }}</div>
        <div class="cd-booking-confirmation__email-message">{{ $t('A confirmation email has been sent to {email}', { email: createdUser.email }) }}</div>
      </div>
      <img class="cd-booking-confirmation__banner-illustration" src="../assets/characters/ninjas/ninja-female-2-laptop-sitting.svg"></img>
    </div>
    <div class="cd-booking-confirmation__event-name">{{ selectedEvent.name }}</div>
    <div class="cd-booking-confirmation__hosted-by-message">{{ $t('Event hosted by {dojoName}', { dojoName: dojoName }) }}</div>
    <div class="cd-booking-confirmation__booking-details-container">
      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-clock-o cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">TIME</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content">
          <span class="cd-booking-confirmation__event-date">{{selectedEvent.dates[0].startTime | cdDateFormatter}}</span>&nbsp;|&nbsp;
          <span class="cd-booking-confirmation__event-times">{{selectedEvent.dates[0].startTime | cdTimeFormatter}} - {{selectedEvent.dates[0].endTime | cdTimeFormatter}}</span>
          <div class="cd-booking-confirmation__recurring-frequency-info" v-if="selectedEvent.type === 'recurring'">
            {{ buildRecurringFrequencyInfo() }}
          </div>
        </div>
      </div>
      <div class="cd-booking-confirmation__booking-details-middle-box cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-map-marker cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">LOCATION</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content">
          <div class="cd-booking-confirmation__event-location">
            {{ `${selectedEvent.address}, ${selectedEvent.city.nameWithHierarchy}, ${selectedEvent.country.countryName}` }}
          </div>
        </div>
      </div>
      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-ticket cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">ATTENDEES</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content">
          <div v-for="booking in bookings">
            <div class="cd-booking-confirmation__booking-name">{{ booking.user.firstName }} {{ booking.user.lastName }}</div>
            <div class="cd-booking-confirmation__booking-session-ticket">{{ booking.ticket.name }} / {{ getSessionName(booking.ticket.id) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="cd-booking-confirmation__line-page-splitter"></div>
    <div class="cd-booking-confirmation__account-info-wrapper">
      <div class="fa fa-check-circle-o cd-booking-confirmation__check-circle"></div>
      <div class="cd-booking-confirmation__account-creation-confirmation">
        {{ $t('CoderDojo Account has been created') }}
        <div class="cd-booking-confirmation__account-creation-confirmation-help-message">
          {{ $t('You can log in and find events hosted by this dojo in My Dojos') }}
        </div>
      </div>
      <div class="fa fa-check-circle-o cd-booking-confirmation__check-circle"></div>
      <div class="cd-booking-confirmation__account-dojo-confirmation cd-booking-confirmation__account-creation-confirmation">{{ $t('You are now subscribed to {dojoName} dojo', {dojoName: dojoName}) }}
        <div class="cd-booking-confirmation__account-dojo-confirmation-help-message">
          {{ $t('You will be notified about future events hosted by this dojo') }}
        </div>
      </div>
    </div>
    <div class="cd-booking-confirmation__event-details-section">
      <div class="cd-booking-confirmation__event-details-header">{{ $t('Event Details') }}</div>
      <div v-html="selectedEvent.description" class="cd-booking-confirmation__event-description"></div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import StoreService from '@/store/store-service';
  import DojosService from '@/dojos/service';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';

  export default {
    name: 'bookingConfirmation',
    props: ['eventId'],
    data() {
      return {
        createdUser: {},
        bookingData: {},
        selectedEvent: {},
        dojoName: null,
        termEvent: { biweekly: 'Every two weeks', weekly: 'Weekly' },
      };
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    computed: {
      bookings() {
        let bookings = [];
        Object.keys(this.bookingData).forEach((ticketId) => {
          const booking = this.bookingData[ticketId];
          bookings = bookings.concat(booking.selectedTickets);
        });
        return bookings;
      },
    },
    methods: {
      loadBookingData() {
        this.createdUser = StoreService.load(`booking-${this.eventId}-user`);
        this.bookingData = StoreService.load(`booking-${this.eventId}-sessions`);
        this.selectedEvent = StoreService.load('selected-event');
      },
      getSessionName(ticketId) {
        return this.bookingData[ticketId].session.name;
      },
      getDojoName() {
        DojosService.getDojoById(this.selectedEvent.dojoId).then((res) => {
          this.dojoName = res.body.name;
        });
      },
      buildRecurringFrequencyInfo() {
        const dayName = moment(this.selectedEvent.dates[0].startTime).format('dddd');
        const recurrence = this.termEvent[this.selectedEvent.recurringType];
        return `${this.$i18n.t(recurrence)} ${this.$i18n.t('on')} ${dayName}s`;
      },
    },
    created() {
      this.loadBookingData();
      this.getDojoName();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-booking-confirmation {
    margin: 0 -16px;
    background-color: #f4f5f6;
    &__banner {
      background-color: @cd-purple;
      color: white;
      display: flex;
      padding: 0 0 0 30px;
      &-left {
        flex: 10;
      }
      &-illustration {
        flex: 2;
        align-self: flex-end;
        padding: 0 32px;
        transform: rotateY(180deg) translateY(15%);
      }
    }
    &__booking {
      &-confirmation {
        margin-top: 88px;
        font-size: 30px;
        font-weight: bold;
      }
      &-details {
        &-container {
          display: flex;
          margin: 32px 30px 0 30px;
        }
        &-box {
          flex: 4;
          background-color: #ffffff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          &-header {
            display: flex;
            border-bottom: solid 1px #eeeeee;
            padding-bottom: 10px;
          }
          &-icon {
            flex: 1;
            font-size: 16px;
            color: @cd-purple;
            margin-top: 16px;
            margin-left: 16px;
          }
          &-title {
            flex: 11;
            font-size: 16px;
            color: @cd-purple;
            font-weight: bold;
            line-height: 1;
            margin-top: 16px;
            margin-right: 16px;
          }
          &-content {
            padding: 8px 16px 16px 16px;
          }
        }
        &-middle-box {
          margin: 0 16px;
        }
      }
      &-name {
        font-weight: bold;
        font-size: 14px;
      }
      &-session-ticket {
        font-size: 14px;
        color: #7b8082;
        margin-bottom: 8px;
      }
    }
    &__email-message {
      margin-bottom: 30px;
      font-size: 18px;
    }
    &__event {
      &-date {
        font-weight: bold;
      }
      &-name {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin-top: 32px;
      }
      &-details {
        &-section {
          background-color: #ffffff;
          margin-top: 60px;
          padding: 48px 30px 140px 30px;
        }
        &-header {
          font-size: 18px;
          font-weight: bold;
          border-bottom: solid 1px #bebebe;
          margin-bottom: 16px;
        }
      }
    }
    &__hosted-by-message {
      font-size: 16px;
      text-align: center;
    }
    &__recurring-frequency-info {
      margin-top: 4px;
    }
    &__line-page-splitter {
      margin: 48px 180px;
      border-bottom: solid 1px #bebebe;
    }
    &__check-circle {
      flex: 1;
      font-size: 24px;
      color: #49b749;
    }
    &__account {
      &-info-wrapper {
        display: flex;
        margin: 0 30px;
      }
      &-creation-confirmation {
        flex: 11;
        font-size: 18px;
        margin: 0 32px 0 0;
        &-help-message {
          font-size: 16px;
          margin-top: 4px;
        }
      }
      &-dojo-confirmation-help-message {
        font-size: 16px;
        margin-top: 4px;
      }
    }
  }
</style>
