<template>
  <div class="cd-dashboard-upcoming-event">
    <div v-if="isLoaded" class="cd-dashboard-upcoming-event__content" :class="{ 'cd-dashboard-upcoming-event__content--booked': hasOrder}">
      <div class="cd-dashboard-upcoming-event__main">
        <h4 v-if="hasOrder">{{ $t('Your next event is "{name}"', { name: event.name }) }}</h4>
        <h4 v-else>{{ $t('"{name}" is the next session available', { name: event.name }) }}</h4>
        <router-link v-if="canBook" class="cd-dashboard-upcoming-event__book" :to="{ name: 'EventSessions', params: { eventId: event.id } }">{{ $t('Book now') }}</router-link>
        <router-link v-if="hasOrder"  class="cd-dashboard-upcoming-event__link" :to="{ name: 'EventSessions', params: { eventId: event.id } }">
          <span v-if="ninjaTickets > 0">{{ $t('{num} "{type}" tickets booked', { num: bookedNinjaTickets, type: $t('Youth') }) }}</span>
          <span v-if="mentorTickets > 0">{{ $t('{num} "{type}" tickets booked', { num: bookedMentorTickets, type: $t('Mentor') }) }}</span>
        </router-link>
        <a v-if="isChampion || isTicketingAdmin" class="cd-dashboard-upcoming-event__link" href="#">
          <span>{{ $t('{booked}/{total} {type} booked', { booked: approvedNinjaTickets, total: totalNinjaTickets, type: 'Youth' }) }}</span>
          <span>{{ $t('{booked}/{total} {type} booked', { booked: approvedMentorTickets, total: totalMentorTickets, type: 'Mentor' }) }}</span>
        </a>
      </div>
      <div class="cd-dashboard-upcoming-event__dojo">
          <h4>{{ dojo.name }}</h4>
          <p>{{ eventDate | cdDateFormatter }}, {{ formattedStartTime }} - {{ formattedEndTime }}</p>
      </div>
    </div>
    <div v-else class="cd-dashboard-upcoming-event__filler cd-filler"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import EventsService from '@/events/service';
  import EventUtils from '@/events/util';

  export default {
    name: 'cd-dashboard-upcoming-event',
    props: ['event', 'dojo'],
    directives: {
      ImgFallback,
    },
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
          !this.hasOrder && this.remainingTickets > 0;
      },
      eventDate() {
        return EventUtils.getNextStartTime(this.event);
      },
      remainingTickets() {
        return this.totalNinjaTickets - this.approvedNinjaTickets;
      },
      approvedNinjaTickets() {
        return this.ticketReduction('ninja', 'approvedApplications');
      },
      totalNinjaTickets() {
        return this.ticketReduction('ninja', 'quantity');
      },
      approvedMentorTickets() {
        return this.ticketReduction('mentor', 'approvedApplications');
      },
      totalMentorTickets() {
        return this.ticketReduction('mentor', 'quantity');
      },
      dojoImageUrl() {
        return `https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${this.dojo.id}`;
      },
      dojoImageFallbackImage() {
        /* eslint-disable global-require */
        return require('../../assets/avatars/dojo-default-logo.png');
        /* eslint-enable global-require */
      },
      hasOrder() {
        return this.orders && this.orders.length > 0;
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
      isChampion() {
        return this.event.usersDojos.filter(usersDojo => usersDojo.userTypes.indexOf('champion') !== -1).length > 0;
      },
      isTicketingAdmin() {
        return this.event.usersDojos.filter(usersDojo => usersDojo.userPermissions.find(perm => perm.name === 'ticketing-admin')).length > 0;
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
    }

    &__dojo {
      padding: 10px;
      flex: 1 1 33.3%;

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
</style>
