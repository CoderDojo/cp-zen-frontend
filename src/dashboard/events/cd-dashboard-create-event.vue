<template>
  <div class="cd-dashboard-create-event" >
    <p v-if="!usesTicketing && maxDojoAge < 1" class="cd-dashboard-events__hint">
			<router-link :to="getTicketingAdminUrl" v-ga-track-click="'create_first_event'">
        {{ $t('Create your first event so attendees can book and you can easily see who\'s attending.') }}
        {{ $t('It\'s simple and only takes 2 minutes!') }}
      </router-link>
		</p>
		<p v-else-if="!usesTicketing && maxDojoAge >= 1" class="cd-dashboard-events__hint">
    {{ $t('We see you don\'t use Zen events.') }}
    <span v-html="$t('If you\'re using Eventbrite for your Dojo you can make it easier for attendees and volunteers to find you by using <a href=\'https://coderdojo.com/2017/07/19/launching-eventbrite-integration-on-the-coderdojo-community-platform/\'>our one-click Eventbrite plugin</a> (it\'s really easy!)')"></span></p>
		<p v-else-if="usesTicketing" class="cd-dashboard-events__hint">
			<router-link :to="getTicketingAdminUrl" v-ga-track-click="'create_event'">{{ $t('Create your next event so attendees can book in!') }}</router-link>
		</p>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'cd-dashboard-create-event',
    props: ['ticketingAdmins', 'oldEvents', 'dojos'],
    computed: {
      maxDojoAge() {
        return Math.max(this.ticketingAdmins.map(ud => ud.dojoId)
          .map(dojoId => this.dojoAge(this.dojos[dojoId], 'years')));
      },
      usesTicketing() {
        return this.oldEvents && this.oldEvents.length > 0;
      },
      getTicketingAdminUrl() {
        return this.ticketingAdmins.length === 1 ?
          `dashboard/dojo/${this.ticketingAdmins[0].dojoId}/event-form` : 'dashboard/my-dojos';
      },
    },
    methods: {
      dojoAge(dojo, format) {
        return moment().diff(dojo.created, format);
      },
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../../common/variables";

  .cd-dashboard-events {
    &__hint {
      text-align: center;
      margin-bottom: @margin;
      .subtitle;
      color: @cd-white;
      text-align: center;
      line-break: pre-wrap;
      a {
        .subtitle;
        color: @cd-white;
        text-decoration: underline;
      }
    }
  }
</style>
