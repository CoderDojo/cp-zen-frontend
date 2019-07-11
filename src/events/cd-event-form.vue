<template>
  <div class="cd-event-container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">

        <div class="cd-event-form">
          <h3 v-show="!editing" class="cd-event-form__header">{{ `${$t('Create an event for')} ${dojo.name}` }}</h3>
          <h3 v-show="editing" class="cd-event-form__header">{{ `${$t('Edit event:')} ${eventName}` }}</h3>
          <form @submit="save">

            <div v-if="submitError">
              <h3 class="text-danger">{{ $t('There was an error processing this request. Please try again or contact support') }}</h3>
            </div>
            <h4 class="cd-event__section-title">{{ $t('Event Title') }}</h4>
            <p class="text-danger" data-cy="title-error" v-show="errors.has('eventName:required')">{{ $t('Title is required') }}</p>
            <input type="text" data-cy="title" name="name" v-model="eventName" class="form-control" data-vv-name="eventName" v-validate="'required'" data-vv-validate-on="blur" :placeholder="$t('e.g. October Dojo')">

            <div class="cd-event-form__location">
              {{ $t('This event uses the address') }}:
              <span v-show="!addressIsVisible">{{ formattedAddress }}</span>
              <i class="fa fa-pencil" @click="addressIsVisible = true" v-show="!addressIsVisible"></i>
              <i class="fa fa-times" @click="addressIsVisible = false" v-show="addressIsVisible"></i>
              <div v-if="addressIsVisible">
                <input type="text" name="city" v-model="eventCity" class="form-control">
                <textarea name="address" v-model="eventAddress" rows="3" class="form-control"></textarea>
              </div>
            </div>

            <div class="cd-event-form__description">
              {{ $t('This event uses the description') }}:
              <span v-show="!descriptionIsVisible">{{ truncatedDescription }}</span>
              <i class="fa fa-pencil" @click="descriptionIsVisible = true" v-show="!descriptionIsVisible"></i>
              <i class="fa fa-times" @click="descriptionIsVisible = false" v-show="descriptionIsVisible"></i>

              <p class="text-danger" v-show="errors.has('eventDescription:required')">{{ $t('Description is required') }}</p>
              <input type="hidden" v-model="eventDescription" v-validate="'required'" name="eventDescription" />
              <div v-if="descriptionIsVisible">
                <VueTrix v-model="eventDescription" ref="trixEditor" />
              </div>
            </div>

            <h4 class="cd-event__section-title">{{ $t('Date and Time') }}</h4>
            <div>
              <p class="text-danger" v-show="errors.has('startTime:required')">{{ $t('Start time is required') }}</p>
              <p class="text-danger" v-show="errors.has('endTime:required')">{{ $t('Finish time is required') }}</p>
              <p class="text-danger" v-show="errors.has('endTime:after')">{{ $t('Finish time must be after start time') }}</p>
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
                <VueCtkDateTimePicker v-model="startTime"
                                      name="startTime"
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
                <VueCtkDateTimePicker v-model="endTime"
                                      v-validate="'date_format:HH:mm|after:startTimePicker'"
                                      name="endTime"
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
              <p class="text-danger" v-show="errors.has('Youth:required')">{{ $t('Number of Youth tickets is required') }}</p>
              <p class="text-danger" v-show="errors.has('Youth:min_value')">{{ $t('Must be greater than 0') }}</p>
              <form-tickets label="Youth"
                            v-validate="'required|min_value:1'"
                            ref="youthTickets"
                            type="ninja"
                            class="cd-event-form__youth-tickets">
              </form-tickets>

              <p class="text-danger" v-show="errors.has('Mentor:required')">{{ $t('Number of Mentor tickets is required') }}</p>
              <p class="text-danger" v-show="errors.has('Mentor:min_value')">{{ $t('Must be greater than 0') }}</p>
              <form-tickets label="Mentor"
                            v-validate="'required|min_value:1'"
                            ref="mentorTickets"
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
            If you need to customise your event further you can still use the <a :href="`/dashboard/dojo/${dojo.id}/event-form`">advanced events form</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import VueTrix from 'vue-trix';
  import { mapGetters } from 'vuex';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import DojosService from '@/dojos/service';
  import Dropdown from '@/common/cd-dropdown';
  import EventsService from '@/events/service';
  import EventStore from '@/events/event-store';
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
        addressIsVisible: false,
        descriptionIsVisible: false,
        dojo: {},
        editing: false,
        latestEvent: undefined,
        submitError: false,
      };
    },
    methods: {
      async initializeStore() {
        if (this.latestEvent) {
          EventStore.commit('setCityFromObject', this.latestEvent.city);
          EventStore.commit('setAddress', this.latestEvent.address);
          EventStore.commit('setDescription', this.latestEvent.description);
          EventStore.commit('generateNextEventDates',
            { lastStartTime: this.latestEvent.startTime,
              lastEndTime: this.latestEvent.endTime,
            });
          EventStore.commit('setTicketQuantitiesFromEvent', this.latestEvent);
        } else {
          EventStore.commit('setDescription', this.dojo.notes);
          EventStore.commit('setAddress', this.dojo.address1);
          EventStore.commit('setCity', this.dojo.city.name);
        }
        EventStore.commit('setCountry', this.dojo.country);
        EventStore.commit('setDojoId', this.dojo.id);
        EventStore.commit('setCreatedBy', this.loggedInUser.id);
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
            if (this.editing) {
              await EventsService.v3.update(EventStore.getters.event);
            } else {
              await EventsService.v3.create(EventStore.getters.event);
            }
            this.$router.push({ name: 'DojoDetailsId', params: { id: this.dojo.id } });
          } catch (err) {
            this.submitError = true;
          }
        }
      },
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      eventName: {
        get() {
          return EventStore.getters.eventName;
        },
        set(value) {
          EventStore.commit('setEventName', value);
        },
      },
      eventAddress: {
        get() {
          return EventStore.getters.address;
        },
        set(value) {
          EventStore.commit('setAddress', value);
        },
      },
      eventCity: {
        get() {
          return EventStore.getters.city;
        },
        set(value) {
          EventStore.commit('setCity', value);
        },
      },
      eventDescription: {
        get() {
          return EventStore.getters.description;
        },
        set(value) {
          EventStore.commit('setDescription', value);
        },
      },
      eventDate: {
        get() {
          return EventStore.getters.eventDate;
        },
        set(value) {
          EventStore.commit('updateEventDate', value);
        },
      },
      startTime: {
        get() {
          return EventStore.getters.startTime;
        },
        set(value) {
          EventStore.commit('updateStartTime', value);
        },
      },
      endTime: {
        get() {
          return EventStore.getters.endTime;
        },
        set(value) {
          EventStore.commit('updateEndTime', value);
        },
      },
      sendEmails: {
        get() {
          return EventStore.getters.sendEmails;
        },
        set(value) {
          EventStore.commit('setSendEmails', value);
        },
      },
      truncatedDescription() {
        const str = EventStore.getters.description.replace(/(<[^<|>]+?>)|(&nbsp;)/gi, ' ');
        const words = str.split(' ').filter(word => word !== '');
        return `${words.slice(0, 6).join(' ')}... `;
      },
      formattedAddress() {
        const str = EventStore.getters.address.replace(/(<[^<|>]+?>)|(&nbsp;)/gi, ' ');
        const words = str.split(' ').filter(word => word !== '');
        return `${words.slice(0, 5).join(' ')}... ${this.eventCity}`;
      },
    },
    async created() {
      const { dojoId, eventId } = this.$route.params;
      this.dojo = (await DojosService.getDojoById(dojoId)).body;

      if (eventId) {
        const event = (await EventsService.v3.load(
        eventId, {
          params: {
            related: 'sessions.tickets',
          },
        })).body;

        if (!event.newForm) {
          this.$router.push(`/dashboard/dojo/${dojoId}/event-form/${eventId}`);
          return;
        }
        EventStore.commit('setEvent', event);
        this.editing = true;
      } else {
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
        this.initializeStore();
      }
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
