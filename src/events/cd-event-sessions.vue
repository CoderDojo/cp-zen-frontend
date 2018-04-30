<template>
  <div class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">
      <span v-if="isSingle">{{ $t('Select Your Tickets') }}</span>
      <span v-else>{{ $t('Select Youth Tickets') }}</span>
    </h1>
     <p>{{ $t('NOTE: Parent attendance is highly encouraged, and in some cases mandatory.') }} <br/>
    {{ $t('Please contact the Dojo if you have any questions.') }}</p>
     <ticket v-for="(_user, index) in users" :user="_user" :event="event" :dob="profile.dob" v-model="usersTickets[index]" :key="_user.id"></ticket>
    <!-- TODO : isn't the index enough rather than generating an uuid ? -->
    <child-ticket v-for="(child, index) in children" ref="allChildComponents" :key="child.id" :eventId="eventId" :event="event" :sessions="sessions" :id="child.id" v-model="child.value" v-on:delete="deleteChildComponent(index)"></child-ticket>

    <div class="cd-event-sessions__add-button" v-if="!isO13">
      <button class="cd-event-sessions__add-youth btn btn-primary" tag="button" @click="addChildComponent"><i class="fa fa-plus" aria-hidden="true"></i> {{ $t('Add Youth Ticket') }}</button>
    </div>

    <div class="cd-event-sessions__phone-number" v-if="showPhone">
      <label>{{ $t('Phone Number') }}</label>
      <p>{{ $t('Since you are acting as a guardian, the Dojo needs your number in case of emergencies.') }}</p>
      <div class="cd-event-sessions__phone-number-input">
        <input class="form-control" v-model="phone" ref="phone" type="text" placeholder="e.g. +353851234567" data-vv-name="phone" data-vv-validate-on="blur" v-validate="{ required: true, regex: /^\+[0-9\ \.\-]+$/ }"/>
      </div>
    </div>
    <p class="text-danger" v-show="showPhone && errors.has('phone:required')">{{ $t('Phone number is required') }}</p>
    <p class="text-danger" v-show="showPhone && errors.has('phone:regex')">{{ $t('* Please include the plus symbol(+) and country code. For example, a phone number in Ireland should begin +353') }}</p>
    <div class="cd-event-sessions__next-block">
      <p v-show="errors.has('submitApplications:required')" class="cd-event-sessions__next-ticket-select-error text-danger"> {{ $t('Please select at least one ticket') }}</p>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="submitBooking" name="submitApplications" v-validate:applications="'required'" >
      <span v-if="this.event.ticketApproval">{{ $t('Request booking for {totalBooked} ticket(s)', { totalBooked }) }}</span>
      <span v-else>{{ $t('Confirm booking for {totalBooked} ticket(s)', { totalBooked }) }}</span>
      </button>
    </div>
  </div>
</template>
<script>
  import uuid from 'uuid/v4';
  import StoreService from '@/store/store-service';
  import UserService from '@/users/service';
  import UserUtils from '@/users/util';
  import service from './service';
  import Ticket from './cd-event-ticket';
  import ChildTicket from './cd-event-add-child-ticket';

  export default {
    name: 'sessions',
    props: ['eventId'],
    components: {
      Ticket,
      ChildTicket,
    },
    data() {
      return {
        sessions: [],
        event: null,
        usersTickets: [],
        children: [],
        validPhone: true,
        phone: '',
        user: {},
        profile: {},
        submitted: false,
      };
    },
    computed: {
      showPhone() {
        return !this.profile.phone && !this.isO13;
      },
      applications() {
        return [].concat(...(this.children).map(child => child.value)).concat(...this.usersTickets);
      },
      totalBooked() {
        return this.applications.length;
      },
      isO13() {
        return UserUtils.isYouthOverThirteen(this.profile.dob);
      },
      isSingle() {
        return this.isO13; // || isMentor;
      },
      users() {
        // TODO : use the proper children which are the existing one for returning flow
        return this.isSingle ? [this.user] : [];
      },
    },
    methods: {
      async addChildComponent() {
        this.children.push({ value: {}, id: uuid() });
      },
      deleteChildComponent(index) {
        this.children.splice(index, 1);
      },
      async addPhoneNumber() {
        if (this.validPhone) {
          this.profile.phone = this.phone;
          return UserService.updateUserProfileData(this.profile);
        }
        return this.validPhone;
      },
      async addNewChildren() {
        if (this.$refs.allChildComponents) {
          return Promise.all((this.$refs.allChildComponents)
            .map(child => child.createChild()));
        }
        return true;
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
        const valid = await this.$validator.validateAll();
        if (valid) {
          const setupSucceeded = await this.setupPrerequisites();
          if (setupSucceeded) {
            await this.bookTickets();
            this.$router.push({ name: 'EventBookingConfirmation', params: { eventId: this.eventId } });
          }
        }
      },
      async loadCurrentUser() {
        const response = await UserService.getCurrentUser();
        this.user = response.body.user;
        return Promise.resolve();
      },
      async loadProfile() {
        this.profile = (await UserService.userProfileData(this.user.id)).body;
        return Promise.resolve();
      },
      loadSessions() {
        service.loadSessions(this.eventId).then((response) => {
          this.sessions = response.body;
          this.event.sessions = this.sessions;
          StoreService.save('selected-event', this.event);
        });
      },
      async setEvent() {
        if (!this.event) {
          this.event = (await service.loadEvent(this.eventId)).body;
          StoreService.save('selected-event', this.event);
          return Promise.resolve();
        }
        return Promise.resolve();
      },
      async loadEvent() {
        StoreService.save(`booking-${this.eventId}-sessions`, {});
        this.event = StoreService.load('selected-event');
        return Promise.resolve();
      },
    },
    async created() {
      await Promise.all([
        this.loadEvent(),
        this.setEvent(),
      ]);
      this.loadSessions();
      await this.loadCurrentUser();
      await this.loadProfile();
      if (!this.isSingle) {
        this.children.push({ value: {}, id: uuid() });
      }
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
