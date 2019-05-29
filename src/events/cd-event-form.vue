<template>
  <div class="cd-event-container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">

        <div class="cd-event-form">
          <h3 class="cd-event-form__header">{{ `${$t('Create an event for')} ${dojo.name}` }}</h3>
          <form @submit="save">
            <h4 class="cd-event__section-title">{{ $t('Event Title') }}</h4>
            <p class="text-danger" v-show="errors.has('name:required')">{{ $t('Title is required') }}</p>
            <input type="text" name="name" v-model="name" class="form-control" data-vv-name="name" v-validate="'required'" data-vv-validate-on="blur" :placeholder="$t('e.g. October Dojo')">

            <div class="cd-event-form__location">
              <!-- is the text relevant when it's been modified? -->
              <!-- what about previous event information, default back to Dojo's or previous event ? -->
              {{ $t('This event uses the Dojo address.') }}
              <span v-show="!addressIsVisible">{{ formattedAddress }}</span>
              <i class="fa fa-pencil" @click="addressIsVisible = true" v-show="!addressIsVisible"></i>
              <i class="fa fa-times" @click="addressIsVisible = false" v-show="addressIsVisible"></i>
              <div v-if="addressIsVisible">
                <input type="text" name="city" v-model="city.name" class="form-control">
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

            <h4 class="cd-event__section-title">{{ $t('Date and Time') }}</h4>
            <div>
              <p class="text-danger" v-show="errors.has('startingTime:required')">{{ $t('Start time is required') }}</p>
              <p class="text-danger" v-show="errors.has('finishTime:required')">{{ $t('Finish time is required') }}</p>
              <p class="text-danger" v-show="errors.has('finishTime:after')">{{ $t('Finish time must be after start time') }}</p>
            </div>

            <div class="cd-event-form__date form-group row">
              <div class="col-sm-5 flow">
                <VueCtkDateTimePicker v-model="eventDate"
                                      name="eventDate"
                                      v-validate="'required'"
                                      :only-date="true"
                                      :input-size="'sm'"
                                      :format="'YYYY-MM-DD'"
                                      :formatted="'ll'"
                                      :no-label=true
                                      :color="'#73449B'"
                                      />
              </div>

              <div class="col-sm-3 flow">
                <VueCtkDateTimePicker v-model="startingTime"
                                      name="startingTime"
                                      v-validate="'required'"
                                      :only-time="true"
                                      :input-size="'sm'"
                                      :format="'HH:mm'"
                                      :formatted="'HH:mm'"
                                      :minute-interval=10
                                      :no-label=true
                                      ref="startTimePicker"
                                      :color="'#73449B'"
                                      />
              </div>
              <div class="col-sm-1 flow">
                <span class="cd-event-form__date-separator">
                  to:
                </span>
              </div>

              <div class="col-sm-3 flow">
                <VueCtkDateTimePicker v-model="finishTime"
                                      v-validate="'date_format:HH:mm|after:startTimePicker'"
                                      name="finishTime"
                                      :only-time="true"
                                      :input-size="'sm'"
                                      :format="'HH:mm'"
                                      :formatted="'HH:mm'"
                                      :minute-interval=10
                                      :no-label=true
                                      :color="'#73449B'"
                                      />
              </div>
            </div>

            <h4 class="cd-event__section-title">{{ $t('Tickets') }}</h4>
            <div class="cd-event-form__tickets">
              <p class="text-danger" v-show="errors.has('Youth tickets:required')">{{ $t('Number of Youth tickets is required') }}</p>
              <p class="text-danger" v-show="errors.has('Youth tickets:min_value')">{{ $t('Must be greater than 0') }}</p>
              <form-tickets label="Youth"
                            v-validate="'required|min_value:1'"
                            ref="youthTickets"
                            :default-quantity="20"
                            type="ninja"
                            class="cd-event-form__youth-tickets">
              </form-tickets>
              <p class="text-danger" v-show="errors.has('Mentor tickets:required')">{{ $t('Number of Mentor tickets is required') }}</p>
              <p class="text-danger" v-show="errors.has('Mentor tickets:min_value')">{{ $t('Must be greater than 0') }}</p>
              <form-tickets label="Mentor"
                            v-validate="'required|min_value:1'"
                            ref="mentorTickets"
                            :default-quantity="5"
                            type="mentor"
                            class="cd-event-form__mentor-tickets">
              </form-tickets>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="sendEmails" />
              <span>{{ $t('Send an email to Dojo members about this event') }}</span>
            </div>
            <div class="form-group">
              <button slot="submit" type="submit" class="btn btn-primary cd-event-form__button-default-submit">
                {{ $t('Publish') }}
              </button>
            </div>
          </form>
          <div class="flow">
            <p>We simplified our events experience, read <a href="TODO">about it here</a>.
            <br/>
            If you need to customise your event further you can still use the <a href="TODO">advanced events form</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import VueTrix from 'vue-trix';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import DojosService from '@/dojos/service';
  import Dropdown from '@/common/cd-dropdown';
  import EventsService from '@/events/service';
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
        dojo: {},
        latestEvent: {},
        // state
        addressIsVisible: false,
        descriptionIsVisible: false,
        public: true,
        // TODO: generate start/end based on previous event
        startingTime: '09:00',
        finishTime: '11:00',
        // TODO: momentjs get month of current locale
        eventDate: `${moment().year()}-${moment().month() + 1}-${moment().date()}`,
        sendEmails: true,
      };
    },
    methods: {
      async populateForm() {
        if (this.latestEvent !== undefined) {
          this.description = this.latestEvent.description;
          this.city = this.latestEvent.city;
          this.address = this.latestEvent.address;
        } else {
          // TODO: use dojo description?
          // this.description = 'standard desc';
          this.address = this.dojo.address1;
          this.city = this.dojo.city;
        }
      },
      async validateForm() {
        try {
          const res = await this.$validator.validateAll();
          return res;
        } catch (err) {
          return false;
        }
      },
      async save(e) {
        e.preventDefault();
        const valid = await this.validateForm();
        if (valid) {
          await EventsService.v3.create({
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
            country: this.dojo.country,
            sessions: this.sessions,
            dojoId: this.dojo.id,
          });
        }
      },

      toggle(field) { // eslint-disable-line no-unused-vars
        // eslint-disable-next-line no-param-reassign
        field = !field;
      },
    },
    computed: {
      truncatedDescription() {
        return this.description.substring(0, 20);
      },
      formattedAddress() {
        return `${this.address.substring(0, 15)}... ${this.city.name}`;
      },
      tickets() {
        return [this.$refs.youthTickets, this.$refs.mentorTickets];
      },
      startTime() {
        const startDay = moment.utc(this.eventDate);
        const startingTimeElements = this.startingTime.split(':');
        startDay.hours(startingTimeElements[0]);
        startDay.minutes(startingTimeElements[1]);
        return startDay;
      },
      endTime() {
        const endDay = moment.utc(this.eventDate);
        const finishTimeElements = this.finishTime.split(':');
        endDay.hours(finishTimeElements[0]);
        endDay.minutes(finishTimeElements[1]);
        return endDay;
      },
      sessions() {
        const tickets = this.tickets.map(t => t.createTicket());
        return [{
          name: 'General',
          description: 'General Session',
          tickets,
        }];
      },
    },
    async created() {
      // TODO: if eventId in params load event, otherwise populate defaults

      // TODO: get previous event, use that info to populate defaults

          // const query = { status: 'published' };
          // query.afterDate = moment().unix();
          // query.utcOffset = moment().utcOffset();
          // query.pageSize = 1;
      const { dojoId } = this.$route.params;

      // const query = { pageSize: 1 };
      const latestEvent = await EventsService.v3.get(
        dojoId,
        {
          params:
          {
            pageSize: 1,
            page: 1,
            orderBy: 'startTime',
            direction: 'desc',
          },
        });

      // TODO: will this error when no events
      this.latestEvent = latestEvent.body.results[0];
      this.dojo = (await DojosService.getDojoById(dojoId)).body;
      this.populateForm();
    },
  };
</script>
<style scoped lang="less">
  @import "../common/styles/cd-events";

  .cd-event-form {
    background: @cd-white;
    border-radius: 3px;
    padding: 0 50px 20px;
    &__header {
      font-size: 20px;
      font-weight: 700;
      background: #ececec;
      margin: 0 -50px 30px;
      border-radius: 3px 3px 0 0;
      padding: 20px 50px;
    }
    &__location, &__description {
      margin-top: @margin;
    }
    &__description {
      margin-bottom: @margin;
    }
    &__date-separator {
      position: relative;
      top: 4px;
    }
    &__button {
      float: right;
    }
    &__button-default-submit {
      width: 100%;
    }
  }
</style>
