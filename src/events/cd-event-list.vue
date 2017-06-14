<template>
  <div class="cd-event-list">
    <h1 class="cd-event-list__header">Upcoming Events</h1>
    <div v-for="event in events" class="cd-event-list__event">
      <div class="cd-event-list__event-details">
        <header class="cd-event-list__event-header">
          <h3 class="cd-event-list__event-name">
            {{ event.name }}
          </h3>
          <h4 class="cd-event-list__event-sessions">
            Sessions: {{ getSessionListForEvent(event) }}
          </h4>
        </header>
        <ul class="cd-event-list__datetime">
          <li v-for="date in event.dates" class="cd-event-list__event-datetime-timestamp">
            {{ date.startTime }}
          </li>
        </ul>
      </div>
      <router-link :to="{name: 'EventDetails', params: {eventId: event.id}}"
                   tag="button" class="btn btn-lg btn-primary cd-event-list__event-view">
        See Details and Book
      </router-link>
    </div>
  </div>
</template>
<script>
  import service from './service';

  export default {
    name: 'event-list',
    props: ['dojoId'],
    data() {
      return {
        events: [],
      };
    },
    methods: {
      loadEvents() {
        service.loadEvents(this.dojoId).then((response) => {
          this.events = response.body;
        });
      },
      getSessionListForEvent(event) {
        return event.sessions.map(session => session.name).join(', ');
      },
    },
    created() {
      this.loadEvents();
    },
  };
</script>
<style scoped lang="less">
  @import "~cd-common/common/_colors";

  .cd-event-list {
    &__header {
      color: @cd-purple;
      font-size: 18px;
      text-transform: uppercase;
      margin: 45px 0 16px 0;
    }

    &__event {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-bottom: 24px;

      &-details {
        display: flex;
      }

      &-header {
        flex: 3;
      }

      &-name {
        font-size: 24px;
        margin: 0;
      }

      &-sessions {
        font-size: 16px;
        color: #7b8082;
        margin: 4px 0;
      }

      &-datetime {
       flex: 1;
        &-timestamp {
          list-style-type: none;
          padding: 0;
          font-size: 18px;
        }
      }

      &-view {
        margin-top: 32px;
      }
    }

  }
</style>
