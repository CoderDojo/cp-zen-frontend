<template>
  <div class="cd-event-container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">

        <div class="cd-event-form">
          <h3 class="cd-event-form__header">{{ `${$t('Create an event for')} ${dojo.name}` }}</h3>
          <form @submit="save">

            <div v-if="submitError">
              <h3 class="text-danger">{{ $t('There was an error processing this request. Please try again or contact support') }}</h3>
            </div>
            <h4 class="cd-event__section-title">{{ $t('Event Title') }}</h4>
            <p class="text-danger" v-show="errors.has('name:required')">{{ $t('Title is required') }}</p>
            <input type="text" name="name" v-model="name" class="form-control" data-vv-name="name" v-validate="'required'" data-vv-validate-on="blur" :placeholder="$t('e.g. October Dojo')">

            <div class="cd-event-form__location">
              <!-- is the text relevant when it's been modified? -->
              <!-- what about previous event information, default back to Dojo's or previous event ? -->
              {{ $t('This event uses the address.') }}:
              <span v-show="!addressIsVisible">{{ formattedAddress }}</span>
              <i class="fa fa-pencil" @click="addressIsVisible = true" v-show="!addressIsVisible"></i>
              <i class="fa fa-times" @click="addressIsVisible = false" v-show="addressIsVisible"></i>
              <div v-if="addressIsVisible">
                <input type="text" name="city" v-model="city.nameWithHierarchy" class="form-control">
                <textarea name="address" v-model="address" rows="3" class="form-control"></textarea>
              </div>
            </div>

            <div class="cd-event-form__description">
              {{ $t('This event uses the description') }}:
              <span v-show="!descriptionIsVisible">{{ truncatedDescription }}</span>
              <i class="fa fa-pencil" @click="descriptionIsVisible = true" v-show="!descriptionIsVisible"></i>
              <i class="fa fa-times" @click="descriptionIsVisible = false" v-show="descriptionIsVisible"></i>

              <p class="text-danger" v-show="errors.has('description:required')">{{ $t('Description is required') }}</p>
              <input type="hidden" v-model="description" v-validate="'required'" name="description" />
              <div v-if="descriptionIsVisible">
                <VueTrix v-model="description" ref="trixEditor" />
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
        latestEvent: undefined,
        // state
        addressIsVisible: false,
        descriptionIsVisible: false,
        public: true,
        startingTime: '09:00',
        finishTime: '11:00',
        // TODO: momentjs get month of current locale
        eventDate: moment().format('YYYY-MM-DD'),
        sendEmails: true,
        submitError: false,
      };
    },
    methods: {
      async populateForm() {
        if (this.latestEvent) {
          await this.populateCityFromLatestEvent();
          await this.populateDatesAndTimesFromLatestEvent();
          await this.populateTicketQuantitiesFromLatestEvent();

          this.description = this.latestEvent.description;
          this.address = this.latestEvent.address;
        } else {
          this.description = this.dojo.notes;
          this.address = this.dojo.address1;
          this.city = { nameWithHierarchy: this.dojo.city.name };
        }
      },
      async populateCityFromLatestEvent() {
        // format the event city correctly :(
        const city = this.latestEvent.city;
        if (city && city.toponymName) {
          city.nameWithHierarchy = city.toponymName;
          delete city.toponymName;
        }
        this.city = city;
      },
      async populateDatesAndTimesFromLatestEvent() {
        const startDate = moment.utc(this.latestEvent.startTime);
        let newDate = startDate.add(7, 'days');
        const inPast = moment().diff(newDate, 'days') > 0;

        if (inPast) {
          const neededDay = startDate.day();
          newDate = (moment().isoWeekday() <= neededDay) ?
            moment().isoWeekday(neededDay) :
            moment().add(1, 'weeks').isoWeekday(neededDay);
        }

        this.eventDate = newDate.format('YYYY-MM-DD');

        const endDate = moment.utc(this.latestEvent.endTime);
        this.startingTime = startDate.format('HH:mm');
        this.finishTime = endDate.format('HH:mm');
      },
      async populateTicketQuantitiesFromLatestEvent() {
        if (this.latestEvent.sessions && this.latestEvent.sessions.length > 0) {
          // If there are any sessions for the last event just take the first one.
          // Any event that has more than one session was created using the old form
          // and it is unlikely to map to the new form structure
          const previousTickets = this.latestEvent.sessions[0].tickets;
          const youthTickets = previousTickets.find(ticket => ticket.name === 'Youth');
          const mentorTickets = previousTickets.find(ticket => ticket.name === 'Mentor');

          if (youthTickets !== undefined) {
            this.$refs.youthTickets.setQuantity(youthTickets.quantity);
          }
          if (mentorTickets !== undefined) {
            this.$refs.mentorTickets.setQuantity(mentorTickets.quantity);
          }
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
          try {
            const foo = await EventsService.v3.create({
              name: this.name,
              description: this.description,
              city: this.city,
              address: this.address,
              dates: [{ startTime: this.startTime, endTime: this.endTime }],
              type: 'one-off',
              status: 'published',
              public: this.public,
              useDojoAddress: false,
              ticketApproval: false,
              notifyOnApplicant: false,
              country: this.dojo.country,
              sessions: this.sessions,
              dojoId: this.dojo.id,
            });

            console.log(foo);
            this.$router.push({ name: 'DojoDetailsId', params: { id: this.dojo.id } });
          } catch (err) {
            this.submitError = true;
          }
        }

        // TODO: forward to event page
      },

      toggle(field) { // eslint-disable-line no-unused-vars
        // eslint-disable-next-line no-param-reassign
        field = !field;
      },
    },
    computed: {
      truncatedDescription() {
        if (this.description) {
          const str = this.description.replace(/<[^<|>]+?>/gi, ' ');
          const words = str.split(' ').filter(word => word !== '');
          return `${words.slice(0, 6).join('  ')}... `;
        }
        return '';
      },
      formattedAddress() {
        const str = this.address.replace(/<[^<|>]+?>/gi, ' ');
        const words = str.split(' ').filter(word => word !== '');
        return `${words.slice(0, 5).join('  ')}... ${this.city.nameWithHierarchy}`;
      },
      tickets() {
        return [this.$refs.youthTickets, this.$refs.mentorTickets];
      },
      startTime() {
        const startDay = moment.utc(this.eventDate, 'YYYY-MM-DD');
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
          // TODO: this needs to be translated?
          name: 'Dojo',
          description: 'Dojo Session',
          tickets,
        }];
      },
    },
    async created() {
      // TODO: if eventId in params load event, otherwise populate defaults

      // TODO: get previous event, use that info to populate defaults
      const { dojoId } = this.$route.params;

      const latestEvent = await EventsService.v3.get(
        dojoId,
        {
          params:
          {
            pageSize: 1,
            page: 1,
            orderBy: 'startTime',
            direction: 'desc',
            related: 'sessions.tickets',
          },
        });

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
