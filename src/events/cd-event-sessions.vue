<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">Select Youth Tickets</h1>
     <p>{{ $t('NOTE: Parent attendance is highly encouraged, and in some cases mandatory.') }} <br/>
    {{ $t('Please contact the Dojo if you have any questions.') }}</p>
    <child-ticket v-for="(child, index) in children" ref="allChildComponents" :key="child.id" :eventId="eventId" :event="event" :sessions="sessions" v-model="child.value" v-on:delete="deleteChildComponent(index)"></child-ticket>
    <p v-show="errors.has('addChildFailed') && totalBooked > 0" class="text-danger">There was a problem adding child: The above child is not valid/complete. Please correct this and try again.</p>

    <div class="cd-event-sessions__add-button">
      <button class="cd-event-sessions__add-youth btn btn-primary" tag="button" @click="addChildComponent"><i class="fa fa-plus" aria-hidden="true"></i> Add Youth Ticket</button>
    </div>

    <div class="cd-event-sessions__phone-number" v-show="showPhone">
      <label>Phone Number</label>
      <p>Since you are acting as a guardian, the Dojo needs your number in case of emergencies.</p>
      <div class="cd-event-sessions__phone-number-input">
        <input class="form-control" v-model="phone" ref="phone" type="text" placeholder="e.g. +353851234567" data-vv-name="phone" data-vv-validate-on="blur" v-validate="{ required: true, regex: /^\+[0-9\ \.\-]+$/ }"/>
      </div>
    </div>
    <p class="text-danger" v-show="showPhone && errors.has('phone:required')">{{ $t('Phone number is required') }}</p>
    <p class="text-danger" v-show="showPhone && errors.has('phone:regex')">* Please include the plus symbol(+) and country code. For example, a phone number in Ireland should begin +353</p>

    <div class="cd-event-sessions__next-block">
      <p v-show="totalBooked <= 0" class="cd-event-sessions__next-ticket-select-error text-danger"> {{ $t('Please select at least one ticket') }}</p>
      <p v-show="errors.has('submitChildComponentsFailed')" class="cd-event-sessions__next-child-error text-danger">There was a problem confirming tickets: A ticket is not valid/complete. Please correct this and try again.</p>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="submitBooking">{{ this.bookingType }} booking for {{totalBooked}} ticket(s)</button>
    </div>
    <!--     <div class="cd-event-sessions__session" v-for="session in sessions">
    <p class="cd-event-sessions__description">{{ session.description }}</p> 
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
        validChildren: null,
        validPhone: true,
        user: {},
        phone: '',
        submitted: false,
      };
    },
    computed: {
      showPhone() {
        return !this.user.phone;
      },
      totalBooked() {
        return this.children.length;
      },
      applications() {
        return [].concat(...(this.children).map(child => child.value));
      },
      bookingType() {
        if (this.event.ticketApproval) {
          return 'Request';
        }
        return 'Confirm';
      },
    },
    methods: {
      async validateAllChildComponents() {
        return Promise.all(this.$refs.allChildComponents.map(
          child => child.$validator.validateAll()));
      },
      async checkValidatedChildComponents() {
        const validatedChildComponents = await this.validateAllChildComponents();
        if (validatedChildComponents.length > 0) {
          this.validChildren = (validatedChildComponents.map(child =>
            child)).every(childIsValid => childIsValid === true);
        }
      },
      async addChildComponent() {
        this.validChildren = true;
        await this.checkValidatedChildComponents();

        if (this.validChildren === false) {
          this.errors.add('addChildFailed', 'Child not valid');
        } else {
          this.errors.clear();
          this.children.push({ value: {}, id: uuid() });
        }
      },
      deleteChildComponent(index) {
        this.children.splice(index, 1);
      },
      async addPhoneNumber() {
        if (this.validPhone) {
          const userProfile = await UserService.userProfileData(this.user.id);
          userProfile.phone = this.phone;
          return UserService.updateUserProfileData(userProfile);
        }
        return this.validPhone;
      },
      async addNewChildren() {
        return Promise.all((this.$refs.allChildComponents).map(child =>
          child.createChild()));
      },
      bookTickets() {
        this.$ga.event(this.$route.name, 'click', 'book_tickets', this.totalBooked);
        return service.manageTickets(this.applications);
      },
      async setupPrerequisites() {
        if (this.showPhone) {
          return Promise.all([this.addPhoneNumber(), this.addNewChildren()]);
        }
        return this.addNewChildren();
      },
      async submitBooking() {
        this.errors.clear();
        if (this.showPhone) {
          this.validPhone = await this.$validator.validateAll();
        }
        this.validChildren = false;
        await this.checkValidatedChildComponents();

        if (this.validChildren) {
          const setupSucceeded = await this.setupPrerequisites();
          if (setupSucceeded) {
            this.bookTickets();
            this.$router.push({ name: 'EventBookingConfirmation', params: { eventId: this.eventId } });
          }
        } else {
          this.errors.add('submitChildComponentsFailed', 'Child not valid');
        }
      },
      async loadCurrentUser() {
        const response = await UserService.getCurrentUser();
        this.user = response.body.user;
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
    // &__description {
    //   margin: 4px 0;
    // }
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
