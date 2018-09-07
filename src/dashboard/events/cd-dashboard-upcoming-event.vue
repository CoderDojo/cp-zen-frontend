<template>
  <div class="cd-dashboard-upcoming-event" :class="{ 'cd-dashboard-upcoming-event--booked': event.order}">
    <div class="cd-dashboard-upcoming-event__main">
      <h4 v-if="order">{{ $t('Your next event is "{name}"', { name: event.name }) }}</h4>
      <h4 v-else>{{ $t('"{name}" is the next session avaiable on the {startTime}', { name: event.name, startTime: eventDate }) }}</h4>
      <router-link v-if="!order && remainingTickets > 0" :to="{ name: 'EventSessions', params: { eventId: event.id } }">{{ $t('Tickets still available') }}</router-link>
    </div>
    <div class="cd-dashboard-upcoming-event__dojo">
      <div class="cd-dashboard-upcoming-event__dojo-logo">
        <img v-img-fallback="{ src: dojoImageUrl, fallback: dojoImageFallbackImage }" />
      </div>
      <div class="cd-dashboard-upcoming-event__dojo-details">
        <h4>{{ dojo.name }}</h4>
        <p>{{ dojo.address1 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import EventUtils from '@/events/util';

  export default {
    name: 'cd-dashboard-upcoming-event',
    props: {
      event: {
        required: true,
        type: Object,
      },
      dojo: {
        required: true,
        type: Object,
      },
    },
    directives: {
      ImgFallback,
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      eventDate() {
        return EventUtils.getNextStartTime(this.event);
      },
      remainingTickets() {
        return this.event.sessions.reduce((acc1, session) => {
          return acc1 + session.tickets.reduce((acc2, ticket) => {
            return acc2 + ticket.quantity - ticket.approvedApplications;
          }, 0);
        }, 0);
      },
      dojoImageUrl() {
        return `https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${this.dojo.id}`;
      },
      dojoImageFallbackImage() {
        /* eslint-disable global-require */
        return require('../../assets/avatars/dojo-default-logo.png');
        /* eslint-enable global-require */
      },
    },
    methods: {
      async loadOrders() {
        const res = await EventService.v3.getOrder(this.loggedInUser.id, {
          params: { eventId: this.event.id },
        });
        this.orders = res.body.results;
      },
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../../common/variables";

  .cd-dashboard-upcoming-event {
    background: @cd-white;
    display: flex;
    margin: 32px 0;
    padding: 0 20px;

    &__main {
      flex: 2 2 66.6%;
      padding: 10px;
    }

    &__dojo {
      display: flex;
      padding: 10px;
      flex: 1 1 33.3%;

      &-logo {
        width: 64px;
        padding: 10px;

        img {
          width: 100%;
        }
      }

      &-details {
        flex: 1;

        p {
          margin: 0;
        }
      }
    }

    &--booked {
      border: 1px solid #ED684A;
      position: relative;

      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 11px;
        height: 22px;
        background-color: #73449B;
        border-style: solid;
        border-color: #ED684A;
        border-width: 1px 1px 1px 0;
        border-radius: 0 11px 11px 0;
        top: 12px;
        left: -1px;
      }

      .cd-dashboard-upcoming-event {
        &__main {
          background-image: url(../../assets/characters/ninjas/CD-Character-Female-1-1.png);
          background-repeat: no-repeat;
          background-position: bottom -60px left;
          background-size: 80px auto;
          padding-left: 100px;
        }
      }
    }
  }
</style>
