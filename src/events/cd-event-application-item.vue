<template>
  <div>
    <div v-for="(ticket, index) in session.tickets" class="cd-event-tickets__ticket">
      <span class="cd-event-tickets__name">{{ ticket.name }}</span>
      <multiselect
        v-bind:value="selected[ticket.id]"
        v-on:input="setSelected($event, ticket)"
        :options="users"
        :custom-label="userFirstName"
        :multiple="true"
        v-on:change="notify(ticket, $event)">
      </multiselect>
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
      prepareSelected() {
        // TODO : load applications
        this.session.tickets.forEach((t) => {
          this.selected[t.id] = [];
        });
      },
      setSelected(event, ticket) {
        this.selected[ticket.id] = event;
        this.$emit('ticket-applications', this.session, ticket, this.selected[ticket.id]);
      },
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
