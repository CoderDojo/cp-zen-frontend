<template>
  <div class="cd-child-ticket__ticket-box">
    <div class="cd-child-ticket__header">
       <h3 class="cd-child-ticket__ticket-name">{{ $t('Ticket')}} {{firstName|addPossession}}</h3>
       <button class="cd-child-ticket__delete-ticket" @click="$emit('delete')"><i class="fa fa-trash" aria-hidden="true" ></i></button>
    </div>
    <form class="cd-child-ticket__body">
      <label>{{ $t('Name')}}</label>
      <div class="cd-child-ticket__child-name">
        <input class="cd-child-ticket__first-name form-control" v-model="firstName" type="text" :placeholder="$t('First Name')" :data-vv-name="`firstName-${id}`" data-vv-validate-on="blur" v-validate="'required'"/>
        <input class="cd-child-ticket__surname form-control" v-model="surname" type="text" :placeholder="$t('Surname')" :data-vv-name="`surname-${id}`" data-vv-validate-on="blur" v-validate="'required'"/>
      </div>
      <p class="cd-child-ticket__first-name-err text-danger" v-show="errors.has(`firstName-${id}:required`)">{{ $t('First name is required') }}</p>
      <p class="cd-child-ticket__surname-err text-danger" v-show="errors.has(`surname-${id}:required`)">{{ $t('Surname is required') }}</p>

      <label>{{ $t('Date of Birth') }}</label>
      <div class="cd-child-ticket__dob-picker-wrapper">
        <vue-dob-picker select-class="form-control" v-model="dob"
                        show-labels="false" month-format="short"
                        :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
                        :proportions="[2, 2, 3]" data-vv-value-path="value" :data-vv-name="`dob-${id}`" v-validate="'required'"></vue-dob-picker>
      </div>
      <p class="cd-child-ticket__dob-err text-danger" v-show="errors.has(`dob-${id}:required`)">{{ $t('Date of Birth is required') }}</p>

      <label>{{ $t('Gender') }}</label>
      <gender-component class="cd-child-ticket__gender-selector" v-model="gender" data-vv-value-path="value" :data-vv-name="`gender-${id}`" v-validate="'required'"></gender-component>
      <p class="gender-err text-danger" v-show="errors.has(`gender-${id}:required`)">{{ $t('Gender is required') }}<br/><a v-on:click="showWhy">{{ $t('Why is this required? Click here to find out more') }}</a></p>
      <p class="gender-why" v-show="genderExplaination && errors.has(`gender-${id}:required`)">{{ $t(`We want to provide activities that appeal to people regardless of their gender.`) }}<br/>{{ $t(`To check how well we are succeeding, we'd like to find out whether or not people of different genders are equally likely to take part.`) }}</p>

      <label>{{ $t('Ticket') }}</label>
      <div class="cd-child-ticket__ticket-selector"> 
        <multiselect v-model="selectedTickets" :options="childTickets" group-label="name" group-values="tickets" :multiple="true" :searchable="false" :group-select="false" :placeholder="$t('Select Event Tickets')" track-by="id" label="name" @close="onBlur" @open="onFocus" :data-vv-name="`tickets-${id}`" v-validate="'required'"></multiselect>
      </div>
      <p class="cd-child-ticket__ticket-select-err text-danger" v-show="errors.has(`tickets-${id}:required`)">{{ $t('Ticket selection is required') }}</p>  

      <special-req-component class="cd-child-ticket__special-req-selector" v-model="specialRequirement"></special-req-component>
    </form>
  </div>
</template>

<script>
  import UserUtils from '@/users/util';
  import UserService from '@/users/service';
  import VueDobPicker from 'vue-dob-picker';
  import Multiselect from 'vue-multiselect';
  import GenderComponent from '@/common/cd-gender-component';
  import SpecialReqComponent from '@/common/cd-special-req-component';
  import addPossession from '@/common/filters/cd-add-possession';
  import TicketMixin from '@/events/cd-event-ticket-mixin';


  export default {
    name: 'ChildTicket',
    inject: ['$validator'],
    mixins: [TicketMixin],
    props: ['sessions', 'eventId', 'event', 'id'],
    filters: {
      addPossession,
    },
    components: {
      VueDobPicker,
      Multiselect,
      GenderComponent,
      SpecialReqComponent,
    },
    data() {
      return {
        firstName: '',
        surname: '',
        dob: null,
        gender: '',
        genderExplaination: false,
        selectedTickets: [],
        userId: null,
        specialRequirement: '',
      };
    },
    methods: {
      showWhy() {
        this.genderExplaination = true;
      },
      onBlur() {
        this.blurTimeout = window.setTimeout(() => {
          this.$emit('blur');
        }, 50);
      },
      onFocus() {
        window.clearTimeout(this.blurTimeout);
      },
      async createChild() {
        return UserService.addChild(this.child)
        .then((response) => {
          this.userId = response.body.userId;
        });
      },
    },
    watch: {
      applications() {
        this.$emit('input', this.applications);
      },
    },
    computed: {
      childTickets() {
        return this.sessions.map(session => ({
          description: session.description,
          eventId: session.eventId,
          id: session.id,
          name: session.name,
          status: session.status,
          tickets: session.tickets
            .filter(ticket => ticket.type === 'ninja' && 'others')
            .map(t => ({
              ...t,
              $isDisabled: this.ticketIsFull(t),
              name: this.ticketIsFull(t) ? `${t.name} ${this.$t('[ this ticket is fully booked ]')}` : `${t.name}`,
            })),
        }));
      },
      name() {
        return `${this.firstName} ${this.surname}`;
      },
      applications() {
        return this.selectedTickets.map(ticket => Object.assign({
          name: this.name,
          dateOfBirth: this.dob,
          eventId: this.eventId,
          ticketName: ticket.name,
          ticketType: ticket.type,
          sessionId: ticket.sessionId,
          dojoId: this.event.dojoId,
          ticketId: ticket.id,
          userId: this.userId,
        }, !this.specialRequirement ? '' : { specialRequirement: this.specialRequirement })));
      },
      child() {
        return {
          name: this.name,
          firstName: this.firstName,
          lastName: this.surname,
          dob: this.dob,
          gender: this.gender,
          userTypes: [UserUtils.isUnderAge(this.dob) ? 'attendee-u13' : 'attendee-o13'],
        };
      },
    },
  };
  </script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../../common/variables";
  .cd-child-ticket {
    &__ticket-box {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 0px 0px 16px;
      margin-bottom: 24px;
    }
    &__header {
      background-color: #f4f5f6;
      padding: 24px;
      display: flex;
      justify-content: space-between;
    }
    &__delete-ticket {
      border: none;
      background-color: transparent;
    }
    &__body {
      padding: 24px;
    }
    &__ticket-name {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
    &__child-name {
      padding: 8px 0px 24px;
    }
    &__first-name, &__surname {
      display: inline;
      max-width: 25%;
    }
    &__dob-picker-wrapper {
      max-width: 50%;
      padding: 8px 0px 24px;
    }
    &__gender-selector, &__special-req-selector {
      max-width: 50%;
      padding: 8px 0px 24px;
    }
    &__ticket-selector {
      max-width: 50%;
      padding: 8px 0px 24px;
      min-height: 32px;
    }
     &__ticket-selector .multiselect {
      font-family: Lato, @font-family-sans-serif;
      font-size: @font-size-base;
      min-height: 32px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
  }
</style>

<style lang="less">
@import "../../common/variables";
@import "~bootstrap/less/variables";
.cd-child-ticket__ticket-selector .multiselect__tags {
  min-height: 32px;
  padding: 2px 40px 0 2px;
}
.cd-child-ticket__ticket-selector .multiselect__tags .multiselect__tags-wrap .multiselect__tag {
  margin-bottom: 0px;
  margin-top: 1px;
}
.cd-child-ticket__ticket-selector .multiselect__tags .multiselect__single{
 font-size: @font-size-base;
 color: #555555;
 vertical-align: middle;
 margin-top: 1px;
 margin-bottom: 0px;
}
.cd-child-ticket__ticket-selector .multiselect__select {
  height: 30px;
}
.cd-child-ticket__dob-picker-wrapper .vue-dob-picker label select {
  font: @font-size-base Lato, @font-family-sans-serif;
}
</style>
