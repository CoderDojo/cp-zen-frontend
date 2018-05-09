<template>
  <div class="cd-event-tickets">
    <div class="cd-event-tickets__head"></div>
    <div class="cd-event-tickets__ticket">
      <span class="cd-event-tickets__name"><span class="cd-event-tickets__name-for">Name:</span>{{ user.firstName }} {{ user.lastName }}</span>
      <div class="cd-event-tickets__ticket-selector"> 
        <multiselect v-model="tickets" :options="ticketsOptions" group-label="name" group-values="tickets" :multiple="true" :searchable="false" :group-select="false" :placeholder="$t('Select tickets')" track-by="id" label="name" @close="onBlur" @open="onFocus" :data-vv-name="`tickets-${user.id}`" v-validate="'required'"></multiselect>
      </div>
      <p class="cd-event-ticket__ticket-select-err text-danger" v-show="errors.has(`tickets-${user.id}:required`)">{{ $t('Ticket selection is required') }}</p>  
    </div>
		<div class='cd-event-tickets__ticket-corner'></div>
  </div>
</template>

<script>
  import UserUtils from '@/users/util';
  import StoreService from '@/store/store-service';
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'TicketForUser',
    inject: ['$validator'],
    props: ['event', 'user', 'dob'],
    data() {
      return {
        tickets: [],
        sessions: [],
      };
    },
    components: {
      Multiselect,
    },
    computed: {
      isNinja() {
        return UserUtils.isUnderAge(this.dob) || UserUtils.isYouthOverThirteen(this.dob);
      },
      ticketsOptions() {
        return this.sessions.map(session => ({
          description: session.description,
          eventId: session.eventId,
          id: session.id,
          name: session.name,
          status: session.status,
          tickets: session.tickets.filter(ticket => this.filterByTicketType(ticket.type)),
        }));
      },
      status() {
        return this.event.ticketApproval ? 'pending' : 'approved';
      },
      applications() {
        return this.tickets.map(ticket => ({
          name: this.user.name,
          dateOfBirth: this.dob,
          eventId: this.event.id,
          status: this.status,
          ticketName: ticket.name,
          ticketType: ticket.type,
          sessionId: ticket.sessionId,
          dojoId: this.event.dojoId,
          ticketId: ticket.id,
          userId: this.user.id,
        }));
      },
    },
    watch: {
      tickets() {
        this.$emit('input', this.applications);
      },
    },
    methods: {
      filterByTicketType(type) {
        const allowedTypes = this.isNinja ? ['ninja', 'others'] : ['mentor'];
        return allowedTypes.includes(type);
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
    created() {
      const event = StoreService.load('selected-event');
      this.sessions = event.sessions;
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  .cd-event-tickets {
    display: inline-flex;
    margin-bottom: 24px;
    position: relative;

    &:before {
      /* http://lea.verou.me/2011/03/beveled-corners-negative-border-radius-with-css3-gradients/ */
      content: '';
      display: block;
      background-size: 50% 50%;
      background-repeat: no-repeat;
      background: linear-gradient(135deg, transparent 10px, @cd-white 0) top left,
        linear-gradient(135deg, transparent 10px, @cd-white 0) top left;
      background-image: radial-gradient(circle at .2% 25%, @cd-white .4em, transparent .5em),
        radial-gradient(circle at .2% 25%, @cd-purple .6em,transparent .7em);
      background-position: top left, bottom left;
      width: 10px;
      position: absolute;
      height: 100%;
    }
    &:after {
      content: '';
      display: block;
      width: 10px;
      height: 100%;
      position: absolute;
      background: white;
      right: 0;
      z-index: 3;
      margin-right: -10px;
    }
    &__head {
      background-color: lighten(@cd-purple, 20%);
      width: 25px;
      border-color: #faa31a;
      border-style: solid;
      border-width: 1px 0px;
    }
    &__ticket {
      display: flex;
      align-items: baseline;
      padding: 16px;
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 0px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      flex-wrap: wrap;

      &-selector {
        flex-basis: 100%;
        margin-top: 12px;
      }

      /* https://codepen.io/elisabeth_hamel/pen/wMweyv */
      &-corner {
        height: 26px;
        right: -8px;
        margin: auto;
        z-index: 2;
        border: 1px solid @cd-orange;
        border-top-width: 3px;
        background-color: @cd-white;
        border-radius: 7px;
        box-sizing: border-box;
      }
     
      &-corner {
        width: 18px;
        position: absolute;
        top: 0;
        bottom: 0;
      }
    }

    &__name {
      flex-basis: 100%;
      font-weight: bold;
      &-for {
        font-weight: normal;
        font-style: italic;
        padding-right: 6px;
      }
    }
  }
</style>
<style lang="less">
@import "../common/variables";
@import "~bootstrap/less/variables";
.cd-event-tickets__ticket-selector .multiselect__tags {
  min-height: 32px;
  padding: 2px 40px 0 2px;
}
.cd-event-tickets__ticket-selector .multiselect__tags .multiselect__tags-wrap .multiselect__tag {
  margin-bottom: 0px;
  margin-top: 1px;
}
.cd-event-tickets__ticket-selector .multiselect__tags .multiselect__single{
 font-size: @font-size-base;
 color: #555555;
 vertical-align: middle;
 margin-top: 1px;
 margin-bottom: 0px;
}
.cd-event-tickets__ticket-selector .multiselect__select {
  height: 30px;
}
.cd-event-tickets__dob-picker-wrapper .vue-dob-picker label select {
  font: @font-size-base Lato, @font-family-sans-serif;
}
</style>

