<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">Select Youth Tickets</h1>
     <p>{{ $t('NOTE: Parent attendance is highly encouraged, and in some cases mandatory.') }} <br/>
    {{ $t('Please contact the Dojo if you have any questions.') }}</p>
    <child-ticket v-for="(child, index) in children" ref="allChildComponents" :key="child.id" :eventId="eventId" :event="event" :sessions="sessions" v-model="child.value" v-on:delete="deleteChildComponent(index)"></child-ticket>
    <p v-show="errors.has('addChildFailed')" class="text-danger">There was a problem adding child: The above child is not valid/complete. Please correct this and try again.</p>

    <div class="cd-event-sessions__add-button">
      <button class="cd-event-sessions__add-youth btn btn-primary" tag="button" @click="addChildComponent"><i class="fa fa-plus" aria-hidden="true"></i> Add Youth Ticket</button>
    </div>

    <div class="cd-event-sessions__phone-number" v-show="showPhone">
      <label>Phone Number</label>
      <p>Since you are over 18, the Dojo needs your number in case of emergencys.</p>
      <div class="cd-event-sessions__phone-number-input">
        <input class="form-control" v-model="phone" ref="phone" type="text" placeholder="e.g. +353851234567" data-vv-name="phone" data-vv-validate-on="blur" v-validate="{ required: true, regex: /^\+[0-9\ \.\-]+$/ }"/>
      </div>
    </div>
    <p class="text-danger" v-show="errors.has('phone:required')">{{ $t('Phone number is required') }}</p>
    <p class="text-danger" v-show="errors.has('phone:regex')">* Please include the country code. For example, a phone number in Ireland should begin +353</p>

    <div class="cd-event-sessions__next-block">
      <p v-show="totalBooked <= 0" class="cd-event-sessions__next-ticket-select-error text-danger"> {{ $t('Please select at least one ticket') }}</p>
      <p v-show="errors.has('submitChildComponentsFailed')" class="cd-event-sessions__next-child-error text-danger">There was a problem confirming tickets: A ticket is not valid/complete. Please correct this and try again.</p>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="next">Confirm booking for {{totalBooked}} tickets</button>
    </div>
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
      </button>
    </div> -->
  </div>
</template>
<script>
  import uuid from 'uuid/v4';
  import StoreService from '@/store/store-service';
  import UserService from '@/users/service';
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
        sessions: [],
        event: null,
        children: [{ value: {}, id: uuid() }],
        valid: true,
        user: {},
        phone: '',
        submitted: false,
      };
    },
    // needs tests for these bois
    computed: {
      showPhone() {
        if (this.user.phone) {
          return false;
        }
        return true;
      },
      totalBooked() {
        return this.children.length;
      },
    },
    methods: {
      // needs tests for these bois
      async validateAllChildComponents() {
        return Promise.all(this.$refs.allChildComponents.map(
          child => child.$validator.validateAll()));
      },
      async addChildComponent() {
        const validatedChildComponents = await this.validateAllChildComponents();
        validatedChildComponents.forEach((childIsValid) => {
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
          this.children.push({ value: {}, id: uuid() });
        }
      },
      deleteChildComponent(index) {
        this.children.splice(index, 1);
      },
      async loadCurrentUser() {
        const response = await UserService.getCurrentUser();
        this.user = response.body.user;
      },
      //
      // quantityBooked(val) {
      //   this.totalBooked = 0;
      //   Object.keys(tickets).forEach((session) => {
      //     if (tickets[session].selectedTickets) {
      //       this.totalBooked += tickets[session].selectedTickets.length;
      //     }
      //   });
      //   this.submitted = false;
      // },
      async next() {
        const validatedChildComponents = await this.validateAllChildComponents();
        validatedChildComponents.forEach((childIsValid) => {
          if (!childIsValid) {
            this.valid = false;
          } else {
            this.valid = true;
          }
        });

        const validPhone = await this.$validator.validateAll();

        if (this.valid === false) {
          this.errors.add('submitChildComponentsFailed', 'Child not valid');
        } else if (validPhone === false) {
          this.errors.add('phone:required', 'Phone number is required');
        } else {
          this.errors.clear();
        // if (this.totalBooked > 0) {
        //   return this.$router.push({ name: 'EventBookingForm',
        // params: { eventId: this.eventId } });
        // }
        // this.submitted = true;
        // return false;
        }
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
      this.loadCurrentUser();
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
      margin-top: 24px;
      &-ticket-error, &-child-error {
        display: block;
      }
    }
    &__add-button {
      padding: 0px 0px 8px;
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
    &__phone-number{
       padding: 24px 0px 24px;
    }
    &__phone-number-input{
      max-width: 25%;
    }
  }
</style>
