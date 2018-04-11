<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">Select Youth Tickets</h1>
     <p>{{ $t('NOTE: Parent attendance is highly encouraged, and in some cases mandatory.') }} <br/>
    {{ $t('Please contact the Dojo if you have any questions.') }}</p>
    <template v-for="(child, index) in children">
      <component :is="child" :key="child.name" :eventId="eventId" :event="event" :sessions="sessions"></component>      
    </template>
<!--     needs test for this error -->
    <p v-show="errors.has('addChildFailed')" class="text-danger">{{ $t('There was a problem adding child: The above child is not valid/complete') }}</p>

    <button class="cd-event-sessions__add-youth btn btn-primary" tag="button" @click="addYouth"><i class="fa fa-plus" aria-hidden="true"></i> Add Another Youth</button>
<!--     <input class="cd-event-sessions__add-youth btn btn-primary" tag="button" type="submit" value="&#xf002; Add Another Youth" /> -->
<!--     <p>{{ $t('Select tickets for the sessions that you wish to attend.') }}</p> -->
<!--     <div class="cd-event-sessions__session" v-for="session in sessions">
      <h3 class="cd-event-sessions__name">{{ session.name }}</h3> -->
<!--       <p class="cd-event-sessions__description">{{ session.description }}</p> -->
<!--       <event-tickets :tickets="session.tickets" :session="session" :event-id="eventId" v-on:update="quantityBooked"></event-tickets>
    </div> -->

<!--     <div class="cd-event-sessions__next-block">
      <label v-show="totalBooked <= 0 && submitted" class="cd-event-sessions__next-error text-danger">
        {{ $t('Please select at least one ticket') }}</label>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="next()">
        {{ $t('Next') }}
      </button> -->
    </div>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import service from './service';
  import EventTickets from './cd-event-tickets';
  import ChildTicket from './cd-event-add-child-ticket';

  export default {
    name: 'sessions',
    props: ['eventId'],
    components: {
      EventTickets,
      ChildTicket,
    },
    data() {
      return {
        children: [ChildTicket],
        valid: true,
        sessions: [],
        event: null,
        totalBooked: 0,
        submitted: false,
      };
    },
    methods: {
      async validateAllChildren() {
        return Promise.all(this.$children.map(child => child.$validator.validateAll()));
      },
      async addYouth() {
        const validatedChildren = await this.validateAllChildren();
        validatedChildren.forEach((childIsValid) => {
          if (!childIsValid) {
            this.valid = false;
          } else {
            this.valid = true;
          }
        });
        if (this.valid === false) {
          this.errors.add('addChildFailed', 'Child not valid');
        } else {
          this.errors.clear();
          this.children.push(ChildTicket);
        }
      },
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
  @import "../common/styles/cd-primary-button";

  .cd-event-sessions {
    &__header {
      font-size: 24px;
      margin: 45px 0 16px 0;
      font-weight: bold;
    }
    &__name {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
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
      .primary-button-large;
      &-error {
        display: block;
      }
    }
    &__add-youth {
      font-family: FontAwesome;
      .primary-button;
      @blue-color: #0093D5;
      background-color: white;
      color:@blue-color;
      border-style: solid;
      border-color:@blue-color;
      border-width: 1px;
    }
  }
</style>
