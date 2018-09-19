<template>
  <div class="cd-dashboard-upcoming-event">
    <div v-if="isLoaded" class="cd-dashboard-upcoming-event__content" :class="{ 'cd-dashboard-upcoming-event__content--booked': hasOrder}">
      <div class="cd-dashboard-upcoming-event__main">
        <h4 v-if="hasOrder && !approvalRequired">{{ $t('"{name}" is booked', { name: event.name }) }}</h4>
        <h4 v-else-if="hasOrder">{{ $t('Your "{name}" tickets are waiting for approval', { name: event.name }) }}</h4>
        <h4 v-else-if="fullyBooked && !event.eventbriteId">{{ $t('"{name}" is fully booked', { name: event.name }) }}</h4>
        <h4 v-else>{{ $t('"{name}" is available to book', { name: event.name }) }}</h4>
        <router-link v-if="canBook" class="cd-dashboard-upcoming-event__book" :to="{ name: 'EventSessions', params: { eventId: event.id } }" v-ga-track-click="'book_now'">{{ $t('Book now') }}</router-link>
        <a v-if="event.eventbriteId"  class="cd-dashboard-upcoming-event__book" :href="event.eventbriteUrl" v-ga-track-exit-nav>{{ $t('Book now') }}</a>
        <router-link v-if="hasOrder"  class="cd-dashboard-upcoming-event__link" :to="{ name: 'EventSessions', params: { eventId: event.id } }" v-ga-track-click="'booked_tickets'">
          <span class="cd-dashboard-upcoming-event__tick fa-stack">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-check fa-stack-1x fa-inverse"></i>
          </span>
          <span class="cd-dashboard-upcoming-event__booked" v-if="bookedNinjaTickets > 0">{{ $t('{num} "{type}" tickets booked', { num: bookedNinjaTickets, type: $t('Youth') }) }}</span>
          <span class="cd-dashboard-upcoming-event__booked" v-if="bookedMentorTickets > 0">{{ $t('{num} "{type}" tickets booked', { num: bookedMentorTickets, type: $t('Mentor') }) }}</span>
        </router-link>
        <div v-if="isChampion || isTicketingAdmin">
          <a v-if="!event.eventbriteId" class="cd-dashboard-upcoming-event__link" :href="`/dashboard/my-dojos/${event.dojoId}/events/${event.id}/applications`" v-ga-track-click="'manage_tickets'">
            <span v-if="totalNinjaTickets > 0">{{ $t('{booked}/{total} {type} booked', { booked: approvedNinjaTickets, total: totalNinjaTickets, type: 'Youth' }) }}</span>
            <span v-if="totalMentorTickets > 0">{{ $t('{booked}/{total} {type} booked', { booked: approvedMentorTickets, total: totalMentorTickets, type: 'Mentor' }) }}</span>
          </a>
          <a v-else-if="event.eventbriteId" :href="`https://www.eventbrite.com/myevent?eid=${event.eventbriteId}`" class="cd-dashboard-upcoming-event__link" v-ga-track-exit-nav>
            {{ $t('Manage') }}
          </a>
        </div>
      </div>
      <div class="cd-dashboard-upcoming-event__dojo">
          <h4 class="cd-dashboard-upcoming-event__dojo-name">{{ dojo.name }}</h4>
          <p>{{ eventDate | cdDateFormatter }}, {{ formattedStartTime }} - {{ formattedEndTime }}</p>
      </div>
    </div>
    <div v-else class="cd-dashboard-upcoming-event__filler cd-filler"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import EventsService from '@/events/service';
  import EventUtils from '@/events/util';

  export default {
    name: 'cd-dashboard-upcoming-event',
    props: ['event', 'dojo'],
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
    },
    data() {
      return {
        orders: null,
      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      isLoaded() {
        return this.event && this.event.id && this.dojo && this.dojo.id && this.orders !== null;
      },
      canBook() {
        return !this.isChampion && !this.isTicketingAdmin &&
          !this.hasOrder && (this.remainingNinjaTickets > 0 || this.remainingMentorTickets > 0);
      },
      eventDate() {
        return EventUtils.getNextStartTime(this.event);
      },
      fullyBooked() {
        return this.remainingNinjaTickets <= 0 && this.remainingMentorTickets <= 0;
      },
      remainingNinjaTickets() {
        return this.totalNinjaTickets - this.approvedNinjaTickets;
      },
      approvedNinjaTickets() {
        return this.ticketReduction('ninja', 'approvedApplications');
      },
      totalNinjaTickets() {
        return this.ticketReduction('ninja', 'quantity');
      },
      remainingMentorTickets() {
        return this.totalMentorTickets - this.approvedMentorTickets;
      },
      approvedMentorTickets() {
        return this.ticketReduction('mentor', 'approvedApplications');
      },
      totalMentorTickets() {
        return this.ticketReduction('mentor', 'quantity');
      },
      hasOrder() {
        return this.orders && this.orders.length > 0 &&
          // eslint-disable-next-line no-return-assign, no-param-reassign
          (this.orders.reduce((acc, ord) => acc += ord.applications.length, 0)) > 0;
      },
      formattedStartTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].startTime);
      },
      formattedEndTime() {
        return this.$options.filters.cdTimeFormatter(this.event.dates[0].endTime);
      },
      bookedNinjaTickets() {
        return this.orders.reduce((acc, order) =>
          acc + order.applications.filter(application => application.ticketType === 'ninja').length, 0);
      },
      bookedMentorTickets() {
        return this.orders.reduce((acc, order) =>
          acc + order.applications.filter(application => application.ticketType === 'mentor').length, 0);
      },
      approvalRequired() {
        return (this.orders.reduce((acc, order) =>
          acc + order.applications.filter(application => application.status === 'pending').length, 0)) > 0;
      },
      isChampion() {
        return this.event.usersDojos.filter(usersDojo => usersDojo.userTypes.indexOf('champion') !== -1).length > 0;
      },
      isTicketingAdmin() {
        return this.event.usersDojos.filter(usersDojo =>
          usersDojo.userPermissions && usersDojo.userPermissions.find(perm => perm.name === 'ticketing-admin')).length > 0;
      },
    },
    methods: {
      ticketReduction(type, field) {
        return this.event.sessions.reduce((acc1, session) =>
          acc1 + session.tickets.filter(ticket => ticket.type === type).reduce((acc2, ticket) =>
            acc2 + ticket[field], 0), 0);
      },
      async loadOrders() {
        const res = await EventsService.v3.getOrder(this.loggedInUser.id, {
          params: {
            query: { eventId: this.event.id },
          },
        });
        this.orders = res.body.results;
      },
    },
    watch: {
      event() {
        this.loadOrders();
      },
    },
    created() {
      if (this.event && this.event.id) {
        this.loadOrders();
      }
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../../common/variables";
  @import "../../common/styles/cd-filler-loading";

  .cd-dashboard-upcoming-event {
    margin: 32px 0;

    &__content {
      background: @cd-white;
      display: flex;
      padding: 0 20px;
    }

    &__main {
      flex: 2 2 66.6%;
      padding: 10px 10px 20px 10px;
      min-height: 100px;
    }

    &__dojo {
      padding: 10px;
      flex: 1 1 33.3%;

      &-name {
        word-break: break-word;
      }

      p {
        margin: 0;
      }
    }

    &__book {
      display: inline-block;
      border: 1px solid @link-color;
      padding: 4px 8px;
      border-radius: 4px;
      margin-top: 4px;
    }

    &__link {
      span {
        margin-right: 8px;
      }

      .cd-dashboard-upcoming-event {
        &__tick {
          font-size: 10px;
          margin-right: 0;

          .fa-circle {
            color: @cd-green;
          }
        }
      }
    }

    &__content--booked, &:first-child &__content {
      border: 1px solid @cd-orange;
      position: relative;

      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 11px;
        height: 22px;
        background-color: @cd-purple;
        border-style: solid;
        border-color: @cd-orange;
        border-width: 1px 1px 1px 0;
        border-radius: 0 11px 11px 0;
        top: 12px;
        left: -1px;
      }

      .cd-dashboard-upcoming-event {
        &__main {
          background-image: url(../../assets/characters/ninjas/CD-Character-Female-2-3.png);
          background-repeat: no-repeat;
          background-position: bottom left;
          background-size: 80px auto;
          padding-left: 100px;
        }
      }
    }

    &:first-child &__content--booked {
      .cd-dashboard-upcoming-event {
        &__main {
          background-image: url(../../assets/characters/ninjas/CD-Character-Female-1-1.png);
          background-position: bottom -60px left;
        }
      }
    }

    &__filler {
      height: 90px;
      background: @cd-very-light-grey;
    }
  }
  @media (max-width: @screen-xs-max) {
    .cd-dashboard-upcoming-event {
      &__content {
        flex-direction: column;
      }
      &__book {
        display: block;
        text-align: center;
      }
    }
  }
</style>
