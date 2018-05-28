<template>
  <div class="cd-booking-confirmation">

    <div class="cd-booking-confirmation__banner">
      <div class="cd-booking-confirmation__banner-left">
        <div class="cd-booking-confirmation__banner-title">{{ title }}</div>
        <div class="cd-booking-confirmation__banner-subtitle" v-html="subtitle"></div>
      </div>
      <img class="cd-booking-confirmation__banner-illustration" src="../assets/characters/ninjas/ninja-female-2-ok-hand.svg"></img>
    </div>

    <div class="cd-booking-confirmation__event-name">{{ event.name }}</div>
    <div class="cd-booking-confirmation__hosted-by-message">
      <hosted-by :props="{ dojoName: dojo.name, dojoRoute: getDojoUrl(dojo) }"></hosted-by>
    </div>

    <div class="cd-booking-confirmation__booking-details-container">

      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-clock-o cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">{{ $t('Time') }}</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content" v-if="event.dates">
          <span class="cd-booking-confirmation__event-date">{{event.dates[0].startTime | cdDateFormatter}}</span>&nbsp;|&nbsp;
          <span class="cd-booking-confirmation__event-times">{{event.dates[0].startTime | cdTimeFormatter}} - {{event.dates[0].endTime | cdTimeFormatter}}</span>
          <div class="cd-booking-confirmation__recurring-frequency-info" v-if="event.type === 'recurring'">
            {{ buildRecurringFrequencyInfo(event) }}
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
            {{ `${event.address}, ${event.city.nameWithHierarchy}, ${event.country.countryName}` }}
          </div>
        </div>
      </div>

      <div class="cd-booking-confirmation__booking-details-box">
        <div class="cd-booking-confirmation__booking-details-box-header">
          <span class="fa fa-ticket cd-booking-confirmation__booking-details-box-icon"></span>
          <span class="cd-booking-confirmation__booking-details-box-title">{{ $t('Attendees') }}</span>
        </div>
        <div class="cd-booking-confirmation__booking-details-box-content">
          <div v-for="application in order.applications">
            <div class="cd-booking-confirmation__booking-name">{{ application.name }}</div>
            <div class="cd-booking-confirmation__booking-session-ticket">{{ application.ticketName }} / {{ getSessionName(application.sessionId) }}</div>
          </div>
        </div>
      </div>

    </div>

    <div class="cd-booking-confirmation__line-page-splitter"></div>

    <div class="cd-booking-confirmation__account-confirmation-wrapper">

      <div class="cd-booking-confirmation__account-confirmation">
        <div class="fa fa-check-circle-o cd-booking-confirmation__account-confirmation-icon"></div>
        <div>
          {{ $t('Your CoderDojo Account has been created') }}
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

      <div class="cd-booking-confirmation__account-confirmation cd-booking-confirmation__account-confirmation-approval" v-show="event.ticketApproval">
        <div class="fa-stack fa-lg color-warning cd-booking-confirmation__account-confirmation-icon">
          <i class="fa fa-circle-o fa-stack-2x"></i>
          <i class="fa fa-hourglass-half fa-stack-1x"></i>
        </div>
        <div>
          <span> {{ $t('Your tickets are now awaiting approval') }} </span>
            <div class="cd-booking-confirmation__account-confirmation-help-message">
              {{ $t('You will be notified when the organizer approves your request.') }}
          </div>
        </div>
      </div>

    </div>

    <div class="cd-booking-confirmation__event-details-section">

      <div class="cd-booking-confirmation__event-details-header">{{ $t('Event Details') }}</div>
      <div v-html="event.description" class="cd-booking-confirmation__event-description"></div>

    </div>
  </div>
</template>
<script>
  import DojosService from '@/dojos/service';
  import EventService from '@/events/service';
  import UserService from '@/users/service';
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
        user: {},
        order: {},
        event: {},
        sessions: [],
        dojo: {},
      };
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    computed: {
      subtitle() {
        return this.event.ticketApproval ?
          this.$t('You will be notified when the organizer approves your request.') :
          this.$t('A confirmation email has been sent to {email}', { email: `<strong>${this.user.email}</strong>` });
      },
      title() {
        return this.event.ticketApproval ?
          this.$t('Booking Request Sent') :
          this.$t('Booking Complete');
      },
    },
    methods: {
      getDojoUrl: DojosUtil.getDojoUrl,
      async loadData() {
        this.user = (await UserService.getCurrentUser()).body.user;
        // TODO : define v3 event loading to save an HTTP call
        this.event = (await EventService.loadEvent(this.eventId)).body;
        this.sessions = (await EventService.loadSessions(this.eventId)).body;
        this.order = (await EventService.v3.getOrder(this.user.id, { params: { 'query[eventId]': this.event.id } })).body.results[0];
        this.dojo = (await DojosService.getDojoById(this.event.dojoId)).body;
      },
      getSessionName(sessionId) {
        return (this.sessions.find(s => s.id === sessionId)).name;
      },
      buildRecurringFrequencyInfo: EventsUtil.buildRecurringFrequencyInfo,
    },
    created() {
      this.loadData();
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
        &-approval {

          .fa-stack {
            font-size: 0.8em;
            color: @brand-warning;
            .fa-stack-2x, .fa-stack-1x {
              text-align: left;
            }
            .fa-hourglass-half {
              font-size: 0.8em;
              padding-left: 7px;
            }
          }
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
