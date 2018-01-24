<template>
  <div class="cd-event-list-item" v-if="isVisible">
    <div class="cd-event-list-item__details">
      <header class="cd-event-list-item__header">
        <h3 class="cd-event-list-item__name">
          {{ event.name }}
        </h3>
        <h4 class="cd-event-list-item__sessions">
          <strong>{{ $t('Sessions') }}:</strong> {{ getSessionListForEvent }}
        </h4>
      </header>
      <div class="cd-event-list-item__datetime">
        <div v-if="!isRecurring" class="cd-event-list-item__date-timestamp">
          {{ event.dates[0].startTime | cdDateFormatter }}
        </div>
        <div v-else>
          <div class="cd-event-list-item__date-series">{{ $t('Next in series:') }}</div>
          <span class="cd-event-list-item__date-timestamp">{{ nextStartTime |  cdDateFormatter }}</span>
        </div>
        <div class="cd-event-list-item__times-timestamp">
          {{ formattedStartTime }} - {{ formattedEndTime }}
        </div>
      </div>
    </div>
    <div v-if="canBook && !isPastEvent" class="cd-event-list-item__view-wrapper">
      <div v-if="event.eventbriteId">
        <a :href="event.eventbriteUrl | cdUrlFormatter" target="_blank" class="btn btn-lg btn-primary cd-event-list-item__view" v-ga-track-click="{ eventCategory: this.$route.name, eventAction: 'click', eventLabel: 'view_eventbrite_event' }">{{ $t('See Details and Book') }}</a>
      </div>
      <router-link :to="bookLink"
                   :disabled="isFull" v-else
                   tag="button" class="btn btn-lg btn-primary cd-event-list-item__view"
                   v-ga-track-click="{ eventCategory: $route.name, eventAction: 'click', eventLabel: 'see_details' }">
        {{ isFull ? $t('Full') : $t('See Details and Book') }}
      </router-link>
    </div>
    <div v-if="isRecurring" class="cd-event-list-item__recurring-info">
      <span class="fa fa-info-circle cd-event-list-item__recurring-info-icon"></span>
      <span class="cd-event-list-item__recurring-info-header">{{ $t('This is a recurring event') }}</span>
      <div class="cd-event-list-item__recurring-info-text">
        {{ $t('{recurringFrequencyInfo} at {formattedStartTime} - {formattedEndTime}, from {formattedFirstDate} to {formattedLastDate}',
        {recurringFrequencyInfo, formattedStartTime, formattedEndTime, formattedFirstDate, formattedLastDate}) }}
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import cdDateFormatter from '@/common/filters/cd-date-formatter';
  import cdTimeFormatter from '@/common/filters/cd-time-formatter';
  import cdUrlFormatter from '@/common/filters/cd-url-formatter';
  import EventTile from './cd-event-tile';

  export default {
    name: 'event-list-item',
    mixins: [EventTile],
    props: ['event', 'dojo', 'usersDojos', 'user'],
    computed: {
      isMember() {
        return !!(this.usersDojos.length);
      },
      canBook() {
        return (!!this.user && this.isMember) || this.dojo.private === 0;
      },
      isVisible() {
        if (!this.isMember) {
          return this.event.public;
        }
        return true;
      },
      getSessionListForEvent() {
        return this.event.sessions.map(session => session.name).join(', ');
      },
      bookLink() {
        if (Vue.config.buildBranch === 'master') {
          return `/dojo/${this.dojo.id}/event/${this.event.id}`;
        }
        return { name: 'EventDobVerification', params: { eventId: this.event.id } };
      },
    },
    filters: {
      cdDateFormatter,
      cdTimeFormatter,
      cdUrlFormatter,
    },
  };
</script>
<style scoped lang="less">
  @import "../common/styles/cd-event-tile";

  .cd-event-list-item {
    .cd-event-tile;
  }
</style>
