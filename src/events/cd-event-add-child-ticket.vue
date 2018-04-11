<template>
  <div class="cd-child-ticket__ticket-box">
    <div class="cd-child-ticket__header">
       <h3 class="cd-child-ticket__ticket-name">{{ $t('Ticket')}} {{firstName|addPossession}} </h3>
    </div>
    <form class="cd-child-ticket__body">
      <label>{{ $t('Name')}}</label>
      <div class="cd-child-ticket__child-name">
        <input class="cd-child-ticket__first-name form-control" v-model="firstName" type="firstName" :placeholder="$t('First Name')" data-vv-name="firstName" data-vv-validate-on="blur" v-validate="'required'"/>
        <input class="cd-child-ticket__surname form-control" v-model="surname" type="surname" :placeholder="$t('Surname')" data-vv-name="surname" data-vv-validate-on="blur" v-validate="'required'"/>
      </div>
      <p class="cd-child-ticket__first-name-err text-danger" v-show="errors.has('firstName:required')">{{ $t('First name is required') }}</p>
      <p class="cd-child-ticket__surname-err text-danger" v-show="errors.has('surname:required')">{{ $t('Surname is required') }}</p>

      <label>{{ $t('Date of Birth') }}</label>
      <div class="cd-child-ticket__dob-picker-wrapper">
        <vue-dob-picker select-class="form-control" v-model="dob" 
                        show-labels="false" month-format="short"
                        :placeholders="[$t('Date'), $t('Month'), $t('Year')]"
                        :proportions="[2, 2, 3]" data-vv-value-path="value" data-vv-name="dob" v-validate="'required'"></vue-dob-picker>                       
      </div> 
      <p class="cd-child-ticket__dob-err text-danger" v-show="errors.has('dob:required')">{{ $t('Date of Birth is required') }}</p>      

      <label>{{ $t('Gender') }}</label>
      <gender-component class="cd-child-ticket__gender-selector" v-model="gender" data-vv-name="gender" v-validate="'required'"></gender-component>
      <p class="gender-err text-danger" v-show="errors.has('gender:required')">{{ $t('Gender is required') }}<br/><a v-on:click="showWhy">{{ $t('Why is this required? Click here to find out more') }}</a></p>
      <p class="gender-why" v-show="whyGender && errors.has('gender:required')">{{ $t(`We want to provide activities that appeal to people regardless of their gender.`) }}<br/>{{ $t(`To check how well we are succeeding, we'd like to find out whether or not people of different genders are equally likely to take part.`) }}</p>  
      
      <label>{{ $t('Ticket') }}</label>
      <div class="cd-child-ticket__ticket-selector"> 
        <multiselect v-model="tickets" :options="childTickets" group-label="name" group-values="tickets" :multiple="true" :searchable="false" :group-select="false" :placeholder="$t('Select Event Tickets')" track-by="id" label="name" @close="onBlur" @open="onFocus" data-vv-name="tickets" v-validate="'required'"></multiselect>
      </div>
      <p class="cd-child-ticket__ticket-select-err text-danger" v-show="errors.has('tickets:required')">{{ $t('Ticket selection is required') }}</p>  
    </form>
  </div>
</template>

<script>
  import VueDobPicker from 'vue-dob-picker';
  import Multiselect from 'vue-multiselect';
  import GenderComponent from '@/common/cd-gender-component';
  import addPossession from '@/common/filters/cd-add-possession';


  export default {
    name: 'ChildTicket',
    props: ['sessions', 'eventId', 'event'],
    filters: {
      addPossession,
    },
    components: {
      VueDobPicker,
      Multiselect,
      GenderComponent,
    },
    data() {
      return {
        firstName: '',
        surname: '',
        dob: null,
        gender: '',
        whyGender: false,
        tickets: [],
      };
    },
    methods: {
      showWhy() {
        this.whyGender = true;
      },
      onBlur() {
        this.blurTimeout = window.setTimeout(() => {
          this.$emit('blur');
        }, 50);
      },
      onFocus() {
        window.clearTimeout(this.blurTimeout);
      },
    },
    computed: {
      childTickets() {
        return this.sessions.map(session => ({
          description: session.description,
          entity: session.entity,
          eventId: session.eventId,
          id: session.id,
          name: session.name,
          status: session.status,
          tickets: session.tickets.filter(ticket => ticket.type === 'ninja' && 'others'),
        }));
      },
      name() {
        return `${this.firstName} ${this.surname}`;
      },
      status() {
        if (this.event.ticketApproval) {
          return 'pending';
        }
        return 'approved';
      },
      applications() {
        return this.tickets.map(ticket => ({
          name: this.name,
          date_of_birth: this.dob,
          event_id: this.eventId,
          status: this.status,
          ticket_name: ticket.name,
          ticket_type: ticket.type,
          session_id: ticket.sessionId,
          created: new Date(),
          dojo_id: this.event.dojoId,
          ticket_id: ticket.id,
        }));
      },
    },
  };
  </script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
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
    &__gender-selector {
      max-width: 50%;
      padding: 8px 0px 24px;
    }         
    &__ticket-selector {
      max-width: 50%;
      padding: 8px 0px 24px;
    }                   
  }   
</style>
