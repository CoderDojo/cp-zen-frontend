<template>
  <div class="cd-event-form">
    <h1 class="cd-event-form__header">{{ $t('Create an event') }}</h1>
    <form @submit="save">

      <p class="text-danger" v-show="errors.has('name:required')">{{ $t('Name is required') }}</p>
      <input type="text" name="name" v-model="name" class="form-control" data-vv-name="name" v-validate="'required'" data-vv-validate-on="blur" :placeholder="$t('e.g. October Dojo')">

      <div class="cd-event-form__location">
        <!-- is the text relevant when it's been modified? -->
        <!-- what about previous event information, default back to Dojo's or previous event ? -->
        {{ $t('This event uses the Dojo address.') }}
        <span v-show="!addressIsVisible">{{ formattedAddress }}</span>
        <i class="fa fa-pencil" @click="addressIsVisible = true" v-show="!addressIsVisible"></i>
        <i class="fa fa-times" @click="addressIsVisible = false" v-show="addressIsVisible"></i>
        <div v-if="addressIsVisible">
          <input type="text" name="city" v-model="city" class="form-control">
          <textarea name="address" v-model="address" rows="3" class="form-control"></textarea>
        </div>
      </div>

      <div class="cd-event-form__description">
        {{ $t('This event uses the previous event description') }}
        <span v-show="!descriptionIsVisible">{{ truncatedDescription }}</span>
        <i class="fa fa-pencil" @click="descriptionIsVisible = true" v-show="!descriptionIsVisible"></i>
        <i class="fa fa-times" @click="descriptionIsVisible = false" v-show="descriptionIsVisible"></i>
        <div v-if="descriptionIsVisible">
          <VueTrix v-model="description" />
        </div>
      </div>

      <div class="cd-event-form__date form-group">
        <input list="days" type="number" name="day" v-model="day" class="form-control">
        <datalist id="days" v-model="day">
          <option v-for="day in 31" :key="index" :value="day">{{ day }} </option>
        </datalist>
        <select name="month" v-model="month">
          <option v-for="(month, index) in months" :value="index">{{ month }}</option>
        </select>
        <input list="years" type="number" name="year" v-model="year" class="form-control">
        <datalist id="years" v-model="year">
          <option v-for="year in 3" :key="index">{{ year + today.year() -1 }} </option>
        </datalist>
      </div>

      <p class="text-danger" v-show="errors.has('startingTime:required')">{{ $t('Start time is required') }}</p>
      <p class="text-danger" v-show="errors.has('finishTime:required')">{{ $t('Finish time is required') }}</p>
      <p class="text-danger" v-show="errors.has('finishTime:after')">{{ $t('Finish time must be after start time') }}</p>
      <div class="cd-event-form__date form-group">
        <VueCtkDateTimePicker v-model="startingTime"
                              name="startingTime"
                              v-validate="'required'"
                              :only-time="true"
                              :input-size="'sm'"
                              :format="'HH:mm'"
                              :formatted="'llll'"
                              :minute-interval=10
                              :no-label=true
                              />
        <span>
          to:
        </span>
        <VueCtkDateTimePicker v-model="finishTime"
                              name="finishTime"
                              v-on:input="finishTimeChanged"
                              :only-time="true"
                              :input-size="'sm'"
                              :format="'HH:mm'"
                              :formatted="'llll'"
                              :minute-interval=10
                              :no-label=true
                              />
      </div>

      <div class="cd-event-form__tickets">
        <p class="text-danger" v-show="errors.has('Youth tickets:required')">{{ $t('Number of Youth tickets is required') }}</p>
        <p class="text-danger" v-show="errors.has('Youth tickets:min_value')">{{ $t('Must be greater than 0') }}</p>
        <form-tickets label="Youth tickets"
                      v-validate="'required|min_value:1'"
                      ref="youthTickets"
                      :default-quantity="20"
                      class="cd-event-form__youth-tickets">
        </form-tickets>
        <p class="text-danger" v-show="errors.has('Mentor tickets:required')">{{ $t('Number of Mentor tickets is required') }}</p>
        <p class="text-danger" v-show="errors.has('Mentor tickets:min_value')">{{ $t('Must be greater than 0') }}</p>
        <form-tickets label="Mentor tickets"
                      v-validate="'required|min_value:1'"
                      ref="mentorTickets"
                      :default-quantity="5"
                      class="cd-event-form__mentor-tickets">
        </form-tickets>
      </div>
      <button slot="submit" type="submit" class="btn btn-primary cd-event-form__button-default-submit">
        {{ $t('Publish') }}
      </button>
    </form>
    <p>We simplified our events experience, read <a href="TODO">about it here</a>.
    <br/>
    If you need to customise your event further you can still use the <a href="TODO">advanced events form</a></p>
  </div>
</template>
<script>
  import moment from 'moment';
  import VueTrix from 'vue-trix';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import DojoService from '@/dojos/service';
  import Dropdown from '@/common/cd-dropdown';
  import EventService from '@/events/service';
  import EventTile from './cd-event-tile';
  import FormTickets from './form/form-tickets';

  export default {
    name: 'event-form',
    mixins: [EventTile],
    components: {
      dropdown: Dropdown,
      formTickets: FormTickets,
      VueTrix,
      VueCtkDateTimePicker,
    },
    data() {
      return {
        name: '',
        description: '',
        city: {},
        address: '',
        day: moment().date(),
        // TODO: momentjs get month of current locale
        month: moment().month(),
        year: new Date().getFullYear(),
        dojo: {},
        today: moment.utc(),
        // state
        addressIsVisible: false,
        descriptionIsVisible: false,
        public: true,
        // TODO: generate start/end based on previous event
        startingTime: '9:00',
        finishTime: '10:00',
      };
    },
    methods: {
      async validateForm() {
        try {
          const res = await this.$validator.validateAll();
          console.log(res);
          return res;
        } catch (err) {
          return false;
        }
      },
      async save(e) {
        e.preventDefault();
        console.log('something');
        const ready = await this.validateForm();
        console.log(ready);
        if (ready) {
          await Promise.all(this.tickets.map(t => t.createTicket()));
          await EventService.v3.create({
            name: this.name,
            description: this.description,
            city: this.city,
            address: this.address,
            dates: [{ startTime: this.startTime, endTime: this.endTime }],
            type: 'one-off',
            status: 'saved',
            public: this.public,
            useDojoAddress: false,
            ticketApproval: false,
            notifyOnApplicant: false,
            country: {
              countryName: 'Ireland',
              countryNumber: 372,
              continent: 'Europe',
              alpha2: 'IE',
              alpha3: 'IRL',
            },
            sessions: this.sessions,
            dojoId: 'a6796f63-db6b-429b-b2bd-612e0f107c84',
          });
        }
      },

      toggle(field) { // eslint-disable-line no-unused-vars
        // eslint-disable-next-line no-param-reassign
        field = !field;
      },
      finishTimeChanged() {
        console.log(this.startTime);
        console.log(this.endTime);
        const isAfter = this.endTime.isAfter(this.startTime);
        console.log('Is it after:', isAfter);
        if (!isAfter) {
          console.log('It is before lets add error');
          this.errors.add(
            {
              field: 'finishTime',
              msg: 'Finish time is after start time',
              rule: 'after',
            });
          console.log(this.errors);
        }
      },
    },
    computed: {
      eventDay() {
        return moment.utc([this.year, this.month, this.day]);
      },
      truncatedDescription() {
        return this.description.substring(0, 20);
      },
      formattedAddress() {
        return `${this.address.substring(0, 15)}... ${this.city}`;
      },
      months() {
        return moment.localeData().monthsShort();
      },
      tickets() {
        return [this.$refs.youthTickets, this.$refs.mentorTickets];
      },
      startTime() {
        console.log('Getting start time');
        const startDay = moment.utc([this.year, this.month, this.day]);
        // const startDay = this.eventDay;
        const startingTimeElements = this.startingTime.split(':');
        console.log('st el:', startingTimeElements);
        startDay.hours(startingTimeElements[0]);
        startDay.minutes(startingTimeElements[1]);
        return startDay;
      },
      endTime() {
        console.log('Getting end time');
        const endDay = moment.utc([this.year, this.month, this.day]);
        // const day = this.eventDay;
        const finishTimeElements = this.finishTime.split(':');
        console.log('ft el:', finishTimeElements);
        endDay.hours(finishTimeElements[0]);
        endDay.minutes(finishTimeElements[1]);
        return endDay;
      },
      sessions() {
        return [{
          name: 'A session',
          description: 'Some session or other',
          tickets: [{
            name: 'tickets',
            type: 'ninja',
            quantity: 3,
          }],
        }];
      },
    },
    async created() {
      const { dojoId } = this.$route.params;
      this.dojo = (await DojoService.getDojoById(dojoId)).body;
      this.address = this.dojo.address1;
      this.city = this.dojo.city;
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-event-form {
    padding-bottom: 5em;
    &__header {
      .title;
    }
    &__location, &__description {
      margin-top: @margin;
    }
    &__description {
      margin-bottom: @margin;
    }
    &__date {
      flex: 1;
      display: flex;
      flex-direction: row;
      // TODO: Proper styling per field, not lazy
      max-width: 50%;
    }
    &__button {
      float: right;
    }
  }
</style>
