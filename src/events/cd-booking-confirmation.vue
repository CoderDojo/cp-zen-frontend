<template>
  <div class="cd-booking-confirmation">

    <div class="cd-booking-confirmation__banner">
      <div class="cd-booking-confirmation__banner-left">
        <div class="cd-booking-confirmation__banner-title">{{ $t('Booking Complete') }}</div>
        <div class="cd-booking-confirmation__banner-subtitle" v-html="$t('A confirmation email has been sent to {email}', { email: `<strong>${createdUser.email}</strong>` })"></div>
      </div>
      <img class="cd-booking-confirmation__banner-illustration" src="../assets/characters/ninjas/ninja-female-2-ok-hand.svg"></img>
    </div>

    <div class="cd-booking-confirmation__event-name">{{ selectedEvent.name }}</div>
    <div class="cd-booking-confirmation__hosted-by-message">
      <hosted-by :props="{ dojoName: dojo.name, dojoRoute: getDojoUrl(dojo) }"></hosted-by>
    </div>

    <div class="cd-booking-confirmation__booking-details-container">

      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-clock-o cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">{{ $t('Time') }}</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content">
          <span class="cd-booking-confirmation__event-date">{{selectedEvent.dates[0].startTime | cdDateFormatter}}</span>&nbsp;|&nbsp;
          <span class="cd-booking-confirmation__event-times">{{selectedEvent.dates[0].startTime | cdTimeFormatter}} - {{selectedEvent.dates[0].endTime | cdTimeFormatter}}</span>
          <div class="cd-booking-confirmation__recurring-frequency-info" v-if="selectedEvent.type === 'recurring'">
            {{ buildRecurringFrequencyInfo(selectedEvent) }}
          </div>
        </div>
      </div>

      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-map-marker cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">{{ $t('Location') }}</span>
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
          <span class="cd-booking-confirmation__booking-details-box-title">{{ $t('Attendees') }}</span>
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

    <div class="cd-booking-confirmation__account-confirmation-wrapper">

      <div class="cd-booking-confirmation__account-confirmation">
        <div class="fa fa-check-circle-o cd-booking-confirmation__account-confirmation-icon"></div>
        <div>
          {{ $t('CoderDojo Account has been created') }}
          <div class="cd-booking-confirmation__account-confirmation-help-message" v-html="$t('You can log in and find events hosted by this dojo in {openLink}My Dojos{closeLink}', { openLink: '<strong><a href=\'/dashboard/my-dojos\'>', closeLink: '</a></strong>' })">
          </div>
        </div>
      </div>

      <div class="cd-booking-confirmation__account-confirmation">
      <div class="fa fa-check-circle-o cd-booking-confirmation__account-confirmation-icon"></div>
      <div>
        <span v-html="$t('You are now subscribed to {dojoName} dojo', {dojoName: `<strong>${dojo.name}</strong>`})"></span>
          <div class="cd-booking-confirmation__account-confirmation-help-message">
            {{ $t('You will be notified about future events hosted by this dojo') }}
          </div>
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
  import StoreService from '@/store/store-service';
  import DojosService from '@/dojos/service';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import TranslationComponentGenerator from '@/common/cd-translation-component-generator';
  import DojosUtil from '@/dojos/util';
  import EventsUtil from '@/events/util';

  const HostedBy = TranslationComponentGenerator('Event hosted by {dojoName}', {
    dojoName: `
      <router-link :to="props.dojoRoute">
        <strong>{{ props.dojoName }}</strong>
      </router-link>
    `,
  });

  export default {
    name: 'bookingConfirmation',
    props: ['eventId'],
    components: {
      HostedBy,
    },
    data() {
      return {
        createdUser: {},
        bookingData: {},
        selectedEvent: {},
        dojo: {},
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
      getDojoUrl: DojosUtil.getDojoUrl,
      loadBookingData() {
        this.createdUser = StoreService.load(`booking-${this.eventId}-user`);
        this.bookingData = StoreService.load(`booking-${this.eventId}-sessions`);
        this.selectedEvent = StoreService.load('selected-event');
      },
      getSessionName(ticketId) {
        return this.bookingData[ticketId].session.name;
      },
      getDojo() {
        DojosService.getDojoById(this.selectedEvent.dojoId).then((res) => {
          this.dojo = res.body;
        });
      },
      buildRecurringFrequencyInfo: EventsUtil.buildRecurringFrequencyInfo,
    },
    created() {
      this.loadBookingData();
      this.getDojo();
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
      padding: 0 0 0 32px;
      &-left {
        flex: 10;
      }

      &-title {
        margin-top: 88px;
        font-size: 30px;
        font-weight: bold;
      }

      &-subtitle {
        margin-bottom: 32px;
        font-size: 18px;
      }

      &-illustration {
        flex: 2;
        align-self: flex-end;
        padding: 0 32px;
        transform-origin: bottom;
        transform: scale(0.9);
      }
    }
    &__booking {
      &-details {
        &-container {
          display: flex;
          margin: 32px 24px 0 24px;
        }
        &-box {
          flex: 4;
          background-color: #ffffff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          margin: 0 8px;
          &-header {
            display: flex;
            border-bottom: solid 1px #eeeeee;
            padding-bottom: 10px;
          }
          &-icon {
            font-size: 16px;
            color: @cd-purple;
            margin-top: 16px;
            margin-left: 16px;
            min-width: 24px;
            max-width: 24px;
          }
          &-title {
            flex: 11;
            font-size: 16px;
            color: @cd-purple;
            font-weight: bold;
            line-height: 1;
            margin-top: 16px;
            margin-right: 16px;
            text-transform: uppercase;
          }
          &-content {
            padding: 8px 16px 16px 16px;
          }
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
          padding: 48px 32px;
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
    &__account {
      &-confirmation {
        display: flex;
        flex: 1;
        font-size: 18px;
        margin: 0 32px 0 0;

        &-wrapper {
          display: flex;
          margin: 48px 32px;
        }

        &-icon {
          font-size: 24px;
          color: #49b749;
          max-width: 32px;
          min-width: 32px;
        }

        &-help-message {
          font-size: 16px;
          margin-top: 4px;
        }
      }
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-booking-confirmation {
      &__banner {
        padding: 0 16px;

        &-title {
          font-size: 24px;
        }

        &-subtitle {
          font-size: 14px;
        }

        &-illustration {
          display: none;
        }
      }

      &__event-name {
        font-size: 16px;
      }

      &__hosted-by-message {
        font-size: 14px;
      }

      &__booking-details {
        &-container {
          flex-direction: column;
          margin: 16px 16px;
        }

        &-box {
          margin: 8px 0;
        }
      }

      &__account {
        &-confirmation {
          margin: 8px 0;
          font-size: 16px;
          font-weight: bold;

          &-wrapper {
            flex-direction: column;
            margin: 32px 16px;
          }

          &-help-message {
            font-weight: normal;
          }
        }
      }

      &__line-page-splitter {
        margin: 24px 16px;
      }

      &__event-details-section {
        padding: 32px 16px;
      }
    }
  }
</style>
