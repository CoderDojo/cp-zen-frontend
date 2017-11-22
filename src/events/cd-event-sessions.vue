<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">{{ $t('Select Event Tickets') }}</h1>
    <div class="cd-event-sessions__session" v-for="session in sessions">
      <h3 class="cd-event-sessions__name">{{ session.name }}</h3>
      <p class="cd-event-sessions__description">{{ session.description }}</p>
      <event-tickets :tickets="session.tickets" :session="session" :event-id="eventId" v-on:update="quantityBooked"></event-tickets>
    </div>

    <div class="cd-event-sessions__next-block">
      <label v-show="totalBooked <= 0 && submitted" class="cd-event-sessions__next-error text-danger">
        {{ $t('Please select at least one ticket') }}</label>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="next()">
        {{ $t('Proceed') }}
      </button>
    </div>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import service from './service';
  import EventTickets from './cd-event-tickets';

  export default {
    name: 'sessions',
    props: ['eventId'],
    components: {
      EventTickets,
    },
    data() {
      return {
        sessions: [],
        event: null,
        totalBooked: 0,
        submitted: false,
      };
    },
    methods: {
      quantityBooked() {
        const tickets = StoreService.load(`booking-${this.eventId}-sessions`);
        this.totalBooked = 0;
        Object.keys(tickets).forEach((session) => {
          if (tickets[session].selectedTickets) {
            this.totalBooked += tickets[session].selectedTickets.length;
          }
        });
        this.submitted = false;
      },
      next() {
        if (this.totalBooked > 0) {
          return this.$router.push({ name: 'EventBookingForm', params: { eventId: this.eventId } });
        }
        this.submitted = true;
        return false;
      },
      loadSessions() {
        service.loadSessions(this.eventId).then((response) => {
          this.sessions = response.body;
          this.event.sessions = this.sessions;
          StoreService.save('selected-event', this.event);
        });
      },
      loadEvent() {
        StoreService.save(`booking-${this.eventId}-sessions`, {});
        this.event = StoreService.load('selected-event');
      },
    },
    created() {
      this.loadEvent();
      this.loadSessions();
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-event-sessions {
    &__header {
      font-size: 24px;
      margin: 45px 0 16px 0;
    }
    &__name {
      color: @cd-purple;
      margin: 0;
      font-size: 18px;
    }
    &__description {
      margin: 4px 0;
    }
    &__session {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;
    }

    &__next {
      &-block {
        margin: 34px 0 16px 0;
      }
      &-error {
        display: block;
      }
    }
  }
</style>
