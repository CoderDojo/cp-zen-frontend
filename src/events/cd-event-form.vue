<template>
  <div class="cd-event-form">
    <div class="cd-event-form__left-column">
      <h1 class="cd-event-form__header">{{ $t('Create an event') }}</h1>
      <form @submit="save">
        <input type="text" name="title" v-model="title" class="form-control" :placeholder="$t('e.g. October Dojo')">
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
            <ckeditor :editor="editor" v-model="description"></ckeditor>
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
        <div class="cd-event-form__date form-group">
          <input type="datetime-local" name="day" :value="today" :min="today">
        </div>
        <div class="cd-event-form__tickets">
          <form-tickets label="Youth tickets" ref="youthTickets" :default-quantity="20" class="cd-event-form__youth-tickets">
            </form-tickets>
          <form-tickets label="Mentor tickets" ref="mentorTickets" :default-quantity="5" class="cd-event-form__mentor-tickets">
            </form-tickets>
        </div>
        <dropdown type="primary" display="splitted" class="cd-event-form__button">
          <button slot="submit" type="submit" class="btn btn-primary cd-event-form__button-default-submit">
            {{ $t('Publish and email members') }}
          </button>
          <li><a href="#">Publish only</a></li>
          <li><a href="#">Save as draft</a></li>
        </dropdown>
      </form>
    </div>
    <div class="cd-event-form__right-column">
      <div class="cd-event-form__info-box">
        <h3 class="cd-event-form__info-box-header">Say "Hi" to our new events!</h3>
        <p>We simplified our events experience, read <a href="TODO">about it here</a>. To use the old more complicated interface, click <a href="TODO">Advanced Events</a></p>
        <p>If you need any help, <a href="mailto:support@coderdojo.org">email support</a>.</p>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import DojoService from '@/dojos/service';
  import Dropdown from '@/common/cd-dropdown';
  import CKEditor from '@ckeditor/ckeditor5-vue';
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import EventTile from './cd-event-tile';
  import FormTickets from './form/form-tickets';

  export default {
    name: 'event-form',
    mixins: [EventTile],
    components: {
      ckeditor: CKEditor.component,
      dropdown: Dropdown,
      formTickets: FormTickets,
    },
    data() {
      return {
        title: '',
        description: '',
        city: '',
        address: '',
        day: moment().date(),
        // TODO: momentjs get month of current locale
        month: moment().month(),
        year: new Date().getFullYear(),
        dojo: {},
        today: moment.utc(),
        //
        editor: ClassicEditor,
        // state
        addressIsVisible: false,
        descriptionIsVisible: false,
      };
    },
    methods: {
      async save(e) {
        e.preventDefault();
        await Promise.all(this.tickets.map(t => t.createTicket()));
      },
      toggle(field) { // eslint-disable-line no-unused-vars
        // eslint-disable-next-line no-param-reassign
        field = !field;
      },
    },
    computed: {
      eventDay() {
        return moment.utc(this.day, this.month, this.year);
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
    },
    async created() {
      const { dojoId } = this.$route.params;
      this.dojo = (await DojoService.getDojoById(dojoId)).body;
      this.address = this.dojo.address1;
      this.city = this.dojo.city.name;
    },
  };
</script>
<style scoped lang="less">
  @import "../common/variables";

  .cd-event-form {
    display: flex;
    flex-direction: row;
    padding-bottom: 5em;
    &__left-column {
      flex: 2;
      display: flex;
      flex-direction: column;
      padding: @margin;
    }
    &__right-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    &__info-box {
      background-color: @side-column-grey;
      padding: @margin;
      &-header {
        margin-top: 10px;
      }
    }
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
