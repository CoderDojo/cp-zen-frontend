<template>
  <div class="row row-no-gutters cd-form-ticket">
    <div class="col-sm-2">
      <label class="cd-form-ticket__label" for="ticketQuantity">{{ $t(label) }}</label>
    </div>
    <div class="col-sm-2">
      <input type="number" class="form-control" v-model="ticketQuantity" name="ticketQuantity" />
    </div>
  </div>
</template>
<script>
  import EventStore from '@/events/event-store';

  export default {
    $_veeValidate: {
      name() {
        return this.label;
      },
      value() {
        return this.ticketQuantity;
      },
    },
    name: 'form-ticket',
    props: [
      'label',
      'default-quantity',
      'type',
    ],
    data() {
      return {
        quantity: null,
      };
    },

    computed: {
      ticketQuantity: {
        get() {
          return EventStore.getters.ticketQuantity(this.type);
        },
        set(value) {
          EventStore.commit('updateTicketQuantity', { type: this.type, quantity: value });
        },
      },
    },
  };
</script>

<style scoped lang="less">
  @import "../../common/variables";

  .cd-form-ticket {
    margin-bottom: @margin;
    &__label {
      width: 16%;
    }
  }
</style>
