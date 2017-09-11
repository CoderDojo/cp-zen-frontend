<template>
  <div>
    <div v-for="(ticket, index) in session.tickets" class="cd-event-tickets__ticket">
      <span class="cd-event-tickets__name">{{ ticket.name }} - {{ ticket.sId }}</span>
      <multiselect
        v-model="selected[index]"
        :options="users"
        :custom-label="userFirstName"
        :multiple="true"
        v-on:change="notify(ticket, $event)">
      </multiselect>
      <pre>{{ selected[ticket.sId] }}</pre>
    </div>
    <pre>{{ selected }}</pre>
  </div>

</template>

<script>
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'EventApplicationItem',
    props: ['session', 'eventId', 'users'],
    data() {
      return {
        selected: {},
      };
    },
    components: {
      Multiselect,
    },
    methods: {
      userFirstName(option) {
        return `${option.firstName}`;
      },
      getSid(ticket) {
        return ticket.sId;
      },
      prepareSelected() {
        // TODO : load applications
        this.session.tickets.forEach((t, i) => {
          this.session.tickets[i].sId = t.id.replace(/-/ig, '');
          this.selected[t.sId] = [];
        });
      },
      notify(ticket, event) {
        console.log('notify', ticket, event);
      },
      // getSelected(ticketId) {
      //   return this.selected[ticketId];
      // },
    },
    created() {
      this.prepareSelected();
    },
  };
</script>
<style scoped lang="less">
  .cd-event-tickets {
    &__ticket {
      display: flex;
      align-items: center;
      margin: 16px 0;
    }

    &__name {
      min-width: 150px;
    }
  }
</style>
