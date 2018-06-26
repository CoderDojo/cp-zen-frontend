<template>
  <div v-if="isDisplayable && !isFull" class="cd-event-sessions">
    <h1 class="cd-event-sessions__header">
      <span v-if="isSingle">{{ $t('Select your tickets') }}</span>
      <span v-else>{{ $t('Select youth tickets') }}</span>
    </h1>
     <p>{{ $t('NOTE: Parent attendance is highly encouraged, and in some cases mandatory.') }} <br/>
    {{ $t('Please contact the Dojo if you have any questions.') }}</p>
    <div class="cd-event-sessions__tickets" v-if="!!existingApplications">
      <ticket v-for="(_user, index) in users" :user="_user" :event="event" :key="_user.userId" :existing-applications="existingApplications[_user.userId]"></ticket>
    </div>
    <!-- TODO : isn't the index enough rather than generating an uuid ? -->
    <child-ticket v-for="(child, index) in children" ref="allChildComponents" :key="child.id" :eventId="eventId" :event="event" :sessions="sessions" :id="child.id" v-on:delete="deleteChildComponent(index)" v-validate.disable="'submitApplications:required'" :deletable="users.length > 0 || children.length > 1"></child-ticket>

    <div class="cd-event-sessions__add-button" v-if="!isO13">
      <button class="cd-event-sessions__add-youth btn btn-primary" tag="button" @click="addChildComponent"><i class="fa fa-plus" aria-hidden="true"></i> {{ $t('Add a new youth') }}</button>
    </div>

    <div class="cd-event-sessions__phone-number" v-if="showPhone">
      <label>{{ $t('Phone number') }}</label>
      <p>{{ $t('Since you are acting as a guardian, the Dojo needs your number in case of emergencies.') }}</p>
      <div class="cd-event-sessions__phone-number-input">
        <input class="form-control" v-model="phone" ref="phone" type="text" placeholder="e.g. +353851234567" data-vv-name="phone" data-vv-validate-on="blur" v-validate="{ required: true, regex: /^\+[0-9\ \.\-]+$/ }"/>
      </div>
      <p class="cd-event-session__phone-number-err-required text-danger" v-show="showPhone && errors.has('phone:required')">{{ $t('Phone number is required') }}</p>
      <p class="cd-event-session__phone-number-err-regex text-danger" v-show="showPhone && errors.has('phone:regex')">{{ $t('* Please include the plus symbol(+) and country code. For example, a phone number in Ireland should begin +353') }}</p>
    </div>
    <div class="cd-event-sessions__next-block" >
      <p v-show="errors.has('submitApplications:required')" class="cd-event-sessions__next-ticket-select-error text-danger"> {{ $t('Please select at least one ticket') }}</p>
      <button class="cd-event-sessions__next btn btn-primary" tag="button" @click="submitBooking" name="submitApplications" v-validate:applications="'required'" v-ga-track-click="'attempt_book_tickets'">
        <span v-if="this.event.ticketApproval">{{ $t('Request booking for {totalBooked} ticket(s)', { totalBooked }) }}</span>
        <span v-else>{{ $t('Confirm booking for {totalBooked} ticket(s)', { totalBooked }) }}</span>
      </button>
    </div>
  </div>
  <div v-else-if="isFull && isDisplayable">
    <div class="cd-event-sessions__no-tickets">
      <div class="cd-event-sessions__no-tickets-emoticon">:(</div>
      <h3>{{ $t('We\'re sorry, there are no tickets left.') }}</h3>
      <h4>{{ $t('Keep an eye out for future events!') }}</h4>
    </div>
  </div>
  <div v-else class="cd-event-sessions cd-filler">
    <h1 class="cd-event-sessions__header cd-event-sessions__header--filler"></h1>
    <div class="cd-event-sessions__tickets">
      <div class="cd-event-sessions__tickets cd-event-sessions__tickets--filler"></div>
    </div>
  </div>
</template>
<script>
  import { omit } from 'lodash';
  import uuid from 'uuid/v4';
  import UserService from '@/users/service';
  import DojoService from '@/dojos/service';
  import UserUtils from '@/users/util';
  import OrderStore from '@/events/order/order-store';
  import service from '../service';
  import Ticket from './cd-event-ticket';
  import EventMixin from '../cd-event-tile';
  import ChildTicket from './cd-event-add-child-ticket';

  export default {
    name: 'sessions',
    props: ['eventId'],
    mixins: [EventMixin],
    components: {
      Ticket,
      ChildTicket,
    },
    data() {
      return {
        orderId: null,
        event: {},
        sessions: [],
        parentTicket: null,
        children: [],
        existingChildren: [],
        existingApplications: null,
        phone: '',
        user: {},
        profile: {},
        userDojos: [],
      };
    },
    computed: {
      isDisplayable() {
        return (this.isSingle || this.isMentoring) || this.hasChildren;
      },
      showPhone() {
        return !this.profile.phone && !this.isO13;
      },
      applications() {
        const applications = OrderStore.getters.applications;
        if (this.parentTicket) {
          applications.push(this.parentTicket);
        }
        return applications;
      },
      totalBooked() {
        return this.applications.length;
      },
      isO13() {
        return UserUtils.isYouthOverThirteen(this.profile.dob);
      },
      dojoRole() {
        return (this.userDojos.filter(ud => ud.dojoId === this.event.dojoId))[0];
      },
      hasChildren() {
        return (this.profile.children && this.profile.children.length > 0) ||
          (this.children && this.children.length > 0);
      },
      isSingle() {
        return this.isO13 || (this.isMentoring && !this.hasChildren);
      },
      isMentoring() {
        return this.dojoRole && (this.dojoRole.userTypes.includes('mentor') || this.dojoRole.userTypes.includes('champion'));
      },
      users() {
        if (this.isSingle) {
          return [this.profile];
        }
        if (this.isMentoring) {
          return [this.profile].concat(this.existingChildren);
        }
        return this.existingChildren;
      },
    },
    methods: {
      async addChildComponent() {
        this.children.push({ value: {}, id: uuid() });
      },
      deleteChildComponent(index) {
        const id = this.children[index].id;
        this.children.splice(index, 1);
        OrderStore.commit('removeApplications', id);
      },
      async addPhoneNumber() {
        this.profile.phone = this.phone;
        return UserService.updateUserProfileData(omit(this.profile, ['userTypes', 'dojos', 'children']));
      },
      async joinDojo() {
        OrderStore.commit('setIsNewDojoMember', true);
        const userType = this.isO13 ? 'attendee-o13' : 'parent-guardian';
        return DojoService.joinDojo(this.profile.userId, this.event.dojoId, [userType]);
      },
      async addNewChildren() {
        if (this.$refs.allChildComponents) {
          return Promise.all((this.$refs.allChildComponents)
            .map(child => child.createChild()));
        }
        return true;
      },
      createParentTicket() {
        const sessionIds = this.applications.map(a => a.sessionId);
        const bookedSessions = this.sessions.filter(s => sessionIds.includes(s.id));
        const possibleTickets = bookedSessions.reduce((arr, s) => arr.concat(s.tickets), []);
        const parentTickets = possibleTickets.filter(t => t.type === 'parent-guardian');
        if (parentTickets.length > 0) {
          this.parentTicket = {
            name: this.profile.name,
            dateOfBirth: this.profile.dob,
            eventId: this.event.id,
            ticketName: parentTickets[0].name,
            ticketType: parentTickets[0].type,
            sessionId: parentTickets[0].sessionId,
            dojoId: this.event.dojoId,
            ticketId: parentTickets[0].id,
            userId: this.profile.userId,
          };
        }
      },
      async bookTickets() {
        if (!this.isO13 && this.hasChildren) {
          this.createParentTicket();
        }
        this.$ga.event(this.$route.name, 'click', 'book_tickets', this.totalBooked);
        if (this.orderId) {
          return service.v3.updateOrder(this.orderId, this.user.id, this.applications);
        }
        return service.v3.createOrder(this.eventId, this.applications);
      },
      async setupPrerequisites() {
        const promises = [this.addNewChildren()];
        if (this.showPhone) {
          promises.push(this.addPhoneNumber());
        }
        if (!this.dojoRole) {
          promises.push(this.joinDojo());
        }
        return Promise.all(promises);
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
      },
      async loadProfile() {
        this.profile = (await UserService.userProfileData(this.user.id)).body;
      },
      loadSessions() {
        service.loadSessions(this.eventId).then((response) => {
          this.sessions = response.body;
          this.event = { ...this.event, sessions: this.sessions };
        });
      },
      async setEvent() {
        this.event = (await service.loadEvent(this.eventId)).body;
      },
      async loadChildren() {
        if (this.profile.children) {
          this.existingChildren = (await Promise.all(
            this.profile.children.map(
              c => UserService.userProfileData(c))))
            .map(res => res.body);
        }
      },
      async loadDojoRelationship() {
        this.userDojos = (await DojoService.getUsersDojos(this.user.id, this.event.dojoId)).body;
      },
      async initStore() {
        const orders = (await service.v3.getOrder(this.user.id, { params: { 'query[eventId]': this.eventId } })).body;
        if (orders.results.length > 0) {
          const order = orders.results[0];
          // Remove the automatic parent ticket
          const manualApplications = order.applications.filter(a => a.ticketType !== 'parent-guardian');
          this.orderId = order.id;
          this.existingApplications = manualApplications.reduce((red, application) => {
            // eslint-disable-next-line no-param-reassign
            red[application.userId] = red[application.userId] ? red[application.userId] : [];
            red[application.userId].push(application);
            return red;
          }, {});
        } else {
          this.existingApplications = {};
        }
      },
    },
    async created() {
      OrderStore.commit('resetApplications');
      // TODO : parallelize
      await this.setEvent();
      this.loadSessions();
      await this.loadCurrentUser();
      await this.loadProfile();
      this.loadChildren();
      await this.loadDojoRelationship();
      await this.initStore();
      if (!this.isSingle && !this.hasChildren) {
        this.children.push({ value: {}, id: uuid() });
      }
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../../common/styles/cd-primary-button";
  @import "../../common/styles/cd-filler-loading";

  .cd-event-sessions {
    &__header {
      font-size: 24px;
      margin: 45px 0 16px 0;
      font-weight: bold;
      &--filler {
        background-color: @cd-very-light-grey;
        height: 24px;
        width: 176px;
      }
    }
    &__next {
      .primary-button-large;
      margin-top: 24px;
      &-ticket-error, &-child-error {
        display: block;
      }
    }
    &__tickets {
      display: flex;
      flex-direction: column;
      align-items: self-end;
      &--filler {
        height: 150px;
        width: 450px;
        background-color: @cd-very-light-grey;
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
    &__no-tickets {
      text-align: center;
      &-emoticon{
        font-size: 15em;
        max-width: 80%;
        max-height: 250px;
        transform: rotate(90deg);
        margin-left: 15%;
      }
    }
  }
</style>
